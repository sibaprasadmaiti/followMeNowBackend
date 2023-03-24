const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const friendModel = require('../models/friends.model');
const followModel = require('../models/follow.model');
const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const settingsService = require('../services/settings.service');

const getFriendById = async (friendId) => {
  try {
    return await friendModel.findOne({ _id: friendId });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const suggestionFriendsList = async (chruchId, memberId) => {
  try {
    const friendsAlready = await friendModel.find(
      { $or: [{ member: memberId }, { friend: memberId }], is_friend: true },
      { member: 1, friend: 1 }
    );

    const friends = friendsAlready.map((item) => {
      if (item.member == memberId) {
        return item.friend.toString();
      } else if (item.friend == memberId) {
        return item.member.toString();
      }
    });
    const myFriends = friends;
    friends.push(memberId);

    let chruchFriendList = []
    if(chruchId){
      chruchFriendList = await userModel.find(
        {
          $and: [
            { parent_id: chruchId },
            {
              _id: { $nin: friends },
            },
          ],
        },
      ).select("_id first_name last_name resize_profile_image");
    }else{
      chruchFriendList = await userModel.find(
        {
          $and: [
            { membership_type: {$ne: 'RM'} },
            {
              _id: { $nin: friends },
            },
          ],
        },
      ).select("_id first_name last_name resize_profile_image");
    }

    chruchFriendList = await Promise.all(
      chruchFriendList.map(async (item) => {
        let [details, isRequested, friendsOfSugFriend, isFollowed] = await Promise.all([
          getUserFullDetails(item._doc._id),
          friendModel
            .findOne({
              $or: [
                { member: item._doc._id, friend: memberId },
                { member: memberId, friend: item._doc._id },
              ],
              is_friend: false,
            })
            .select('member'),
          friendModel.find(
            { $or: [{ member: item._doc._id }, { friend: item._doc._id }], is_friend: true },
            { member: 1, friend: 1 }
          ),
          followModel.count({ following: memberId, follower: item._doc._id }),
        ]);

        friendsOfSugFriend = friendsOfSugFriend.map((forf) => {
          if (forf.member.toString() == details._id.toString()) {
            return forf.friend.toString();
          } else if (forf.friend.toString() == details._id.toString()) {
            return forf.member.toString();
          }
        });

        const mutualFriends = friendsOfSugFriend.filter((el) => {
          return myFriends.indexOf(el) >= 0;
        });

        const mutualFriendDetails = !mutualFriends.length
          ? []
          : mutualFriends.length > 2
          ? await getUserFullDetails(mutualFriends.slice(0, 2))
          : await getUserFullDetails(mutualFriends);

        details.isRequested = false;
        details.sendByMe = false;
        details.isFollowed = false;
        details.mutual_friend_count = mutualFriends.length;
        details.mutual_friend_details = mutualFriendDetails;
        if (isFollowed) details.isFollowed = true;
        if (isRequested && isRequested.member) details.isRequested = true;
        if (isRequested && isRequested.member == memberId) details.sendByMe = true;

        return details;
      })
    );

    return chruchFriendList;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const searchFriends = async (chruchId, memberId, name, pageNo) => {
  try {
    // let [chruchMemberList, chruchMemberCount] = await Promise.all([
    //   userModel
    //     .find({
    //       $and: [
    //         { parent_id: chruchId },
    //         {
    //           _id: { $ne: memberId },
    //         },
    //         {
    //           full_name: {
    //             $regex: name,
    //             $options: '$i',
    //           },
    //         },
    //       ],
    //     })
    //     .select('_id').limit(15),
    //   userModel.count({
    //     $and: [
    //       { parent_id: chruchId },
    //       {
    //         _id: { $ne: memberId },
    //       },
    //       {
    //         full_name: {
    //           $regex: name,
    //           $options: '$i',
    //         },
    //       },
    //     ],
    //   }),
    // ]);

    let chruchMemberList = []
    if(chruchId){
      chruchMemberList = await userModel
        .find({
          $and: [
            { parent_id: chruchId },
            {
              _id: { $ne: memberId },
            },
            {
              full_name: {
                $regex: name,
                $options: '$i',
              },
            },
          ],
        })
        .select('_id')
    }else{
      chruchMemberList = await userModel
        .find({
          $and: [
            { membership_type: {$ne: 'RM'} },
            {
              _id: { $ne: memberId },
            },
            {
              full_name: {
                $regex: name,
                $options: '$i',
              },
            },
          ],
        })
        .select('_id')
    }

    chruchMemberList = await Promise.all(
      chruchMemberList.map(async (item) => {
        const [details, isFriend] = await Promise.all([
          getUserFullDetails(item._id),
          friendModel.count({
            $or: [
              { member: item._id, friend: memberId },
              { member: memberId, friend: item._id },
            ],
            is_friend: true,
          }),
        ]);

        isFriend ? (details.isFriend = true) : (details.isFriend = false);
        return details;
      })
    );

    return { chruchMemberList: chruchMemberList, chruchMemberCount: 100 };
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const sendReqest = async (body) => {
  try {
    return await friendModel.create(body);
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const removeFriendFromList = async (body) => {
  try {
    const removeFriend = await friendModel.create(body);
    if (!removeFriend) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Friend not found');
    }
    return removeFriend;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went  error');
  }
};

const acceptRequest = async (Id, memberId) => {
  try {
    const friend = await friendModel.findOne({
      $or: [
        { member: Id, friend: memberId },
        { member: memberId, friend: Id },
      ],
    });
    if (!friend) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Friend not found');
    }

    await friendModel.updateOne({ _id: friend._id }, { is_friend: true, confirm_date: new Date() });
    return friend;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const cancelRequest = async (Id, memberId) => {
  try {
    const friend = await friendModel.findOne({
      $or: [
        { member: Id, friend: memberId },
        { member: memberId, friend: Id },
      ],
    });

    if (!friend) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Friend not found');
    }
    // if (friend.is_friend == true) {
    //   throw new ApiError(httpStatus.NOT_FOUND, 'You are already friend');
    // }
    await friendModel.remove({ _id: friend._id });
    return friend;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const getUserFullDetails = async (id) => {
  try {
    const isIdArray = Array.isArray(id);
    if (isIdArray) {
      let details = await userModel.find(
        {
          _id: { $in: id },
        }
      ).select("_id membership_type first_name last_name resize_profile_image about_you createdAt user_address slug role");

      return details;
    } else {
      let details = await userModel.findOne(
        {
          _id: id,
        }
      ).select("_id membership_type first_name last_name resize_profile_image about_you createdAt user_address slug role");

      return details._doc;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

const memberFriendList = async (memberId) => {
  try {
    const friendsAlready = await friendModel.find(
      { $or: [{ member: memberId }, { friend: memberId }], is_friend: true },
      { _id: 1, member: 1, friend: 1, confirm_date: 1 }
    );

    const friends = friendsAlready.map((item) => {
      if (item.member == memberId) {
        return item.friend.toString();
      } else if (item.friend == memberId) {
        return item.member.toString();
      }
    });

    const friendsArr = await Promise.all(
      friends.map(async (p) => {
        const [myFriendList, friendsFriend, isFollowed] = await Promise.all([
          getUserFullDetails(p),
          friendModel.find({ $or: [{ member: p }, { friend: p }], is_friend: true }, { _id: 1, member: 1, friend: 1 }),
          followModel.count({ following: memberId, follower: p }),
        ]);

        const friendIds = friendsFriend.map((item) => {
          if (item.member == p) {
            return item.friend.toString();
          } else if (item.friend == p) {
            return item.member.toString();
          }
        });

        const mutualFriendIds = friendIds.filter((el) => {
          return friends.indexOf(el) >= 0;
        });

        const mutualFriends = !mutualFriendIds.length
          ? []
          : mutualFriendIds.length > 2
          ? await getUserFullDetails(mutualFriendIds.slice(0, 2))
          : await getUserFullDetails(mutualFriendIds);

        myFriendList.isFollowed = false;
        if (isFollowed) myFriendList.isFollowed = true;
        myFriendList.mutual_friend_count = mutualFriendIds.length;
        myFriendList.mutual_friend_details = mutualFriends;

        return myFriendList;
      })
    );
    return friendsArr;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const friendRequestList = async (memberId) => {
  try {
    const [requestedFriends, myFriends] = await Promise.all([
      friendModel.find({ friend: memberId, is_friend: false }, { member: 1, request_date: 1 }),
      friendModel.find({ $or: [{ member: memberId }, { friend: memberId }], is_friend: true }, { member: 1, friend: 1 }),
    ]);

    const friends = myFriends.map((friend) => {
      if (friend.member == memberId) {
        return friend.friend.toString();
      } else if (friend.friend == memberId) {
        return friend.member.toString();
      }
    });

    const list = await Promise.all(
      requestedFriends.map(async (rf) => {
        let [friendDetails, friendsOfReqFriend, isFollowed] = await Promise.all([
          getUserFullDetails(rf.member),
          friendModel.find(
            { $or: [{ member: rf.member }, { friend: rf.member }], is_friend: true },
            { member: 1, friend: 1 }
          ),
          followModel.count({ following: memberId, follower: rf.member }),
        ]);

        friendsOfReqFriend = friendsOfReqFriend.map((forf) => {
          if (forf.member.toString() == rf.member.toString()) {
            return forf.friend.toString();
          } else if (forf.friend.toString() == rf.member.toString()) {
            return forf.member.toString();
          }
        });

        const mutualFriends = friendsOfReqFriend.filter((el) => {
          return friends.indexOf(el) >= 0;
        });

        const mutualFriendDetails = !mutualFriends.length
          ? []
          : mutualFriends.length > 2
          ? await getUserFullDetails(mutualFriends.slice(0, 2))
          : await getUserFullDetails(mutualFriends);
        friendDetails.isFollowed = false;
        if (isFollowed) friendDetails.isFollowed = true;
        friendDetails.request_date = rf.request_date;
        friendDetails.mutual_friend_count = mutualFriends.length;
        friendDetails.mutual_friend_details = mutualFriendDetails;

        return friendDetails;
      })
    );

    return list;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const friendDetails = async (friendId) => {
  try {
    const settingsData = await settingsService.getMemberSettings(friendId);
    const friendsDetails = await userService.getUserById(friendId);

    let details = {
      settingsData,
      friendsDetails,
    };
    return details;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const friendProfileDetails = async (friendId) => {
  try {
    const details = await userModel.findOne(
      {
        _id: friendId,
      },
      { _id: 1, first_name: 1, last_name: 1, resize_profile_image: 1, user_address: 1, user_country: 1, cover_image: 1 }
    );
    return details;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const searchTagFriends = async (memberId, name) => {
  try {
    // const friends = await friendModel.find({$or: [
    //   { member: memberId },
    //   { friend: memberId },
    // ],
    // is_friend: true,},{member: 1, friend: 1}).populate({path: 'member',populate: {
    //   path: 'friend',
    // }, match: { full_name: {
    //   $regex: name,
    //   $options: '$i',
    // }}, select: 'full_name _id resize_profile_image'})

    const friends = await friendModel.find({$or: [
      { member: memberId },
      { friend: memberId },
    ],
    is_friend: true,},{member: 1, friend: 1})

    const friendIds = friends.map((item) => {
      if (item.member == memberId) {
        return item.friend.toString();
      } else if (item.friend == memberId) {
        return item.member.toString();
      }
    });

    const users = await userModel.find({_id: {$in : friendIds}, full_name: {
      $regex: name,
      $options: '$i',
    }}).select("full_name _id resize_profile_image")

    return users;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const tagFriendList = async (memberId) => {
  try {
    const friends = await friendModel.find({$or: [
      { member: memberId },
      { friend: memberId },
    ],
    is_friend: true,},{member: 1, friend: 1})

    const friendIds = friends.map((item) => {
      if (item.member == memberId) {
        return item.friend.toString();
      } else if (item.friend == memberId) {
        return item.member.toString();
      }
    });

    const users = await userModel.find({_id: {$in : friendIds}}).select("full_name _id resize_profile_image")

    return users;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const assignRole = async (friendId, role) => {
  try {
    return await userModel.updateOne({ _id: friendId }, { role: role });
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const memberRequestList = async (memberId) => {
  try {

    let requestList = await userModel.find(
      {is_approved: false, parent_id: memberId}
    ).select('_id first_name last_name full_name resize_profile_image role user_address user_country user_state postal_code user_city membership_type slug');

    return requestList;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const acceptMemberRequest = async (friendId) => {
  try {
    return await userModel.updateOne({ _id: friendId }, { is_approved: true });
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const memberList = async (memberId) => {
  try {

    const memberList = await userModel.find(
      {is_approved: true, parent_id: memberId}
    ).select('_id first_name last_name full_name resize_profile_image role user_address user_country user_state postal_code user_city membership_type slug');

    return memberList;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const searchMembers = async (chruchId,name, pageNo) => {
  try {
    const chruchMemberList = await userModel
        .find({
          $and: [
            { parent_id: chruchId },
            {
              is_approved: true
            },
            {
              full_name: {
                $regex: name,
                $options: '$i',
              },
            },
          ],
        })
        .select('_id first_name last_name full_name resize_profile_image role user_address user_country user_state postal_code user_city membership_type slug')

    return { chruchMemberList: chruchMemberList, chruchMemberCount: 100 };
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const leaderList = async (memberId) => {
  try {

    const leaderList = await userModel.find(
      {role: 'leadership', parent_id: memberId}
    ).select('_id first_name last_name full_name resize_profile_image role user_address user_country user_state postal_code user_city membership_type slug');

    return leaderList;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const searchLeaders = async (chruchId,name, pageNo) => {
  try {
    const chruchLeaderList = await userModel
        .find({
          $and: [
            { parent_id: chruchId },
            {
              role: 'leadership'
            },
            {
              full_name: {
                $regex: name,
                $options: '$i',
              },
            },
          ],
        })
        .select('_id first_name last_name full_name resize_profile_image role user_address user_country user_state postal_code user_city membership_type slug')

    return { chruchLeaderList: chruchLeaderList, totalLeaders: 100 };
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const ministryList = async (memberId) => {
  try {

    const memberList = await userModel.find(
      {role: 'ministries', parent_id: memberId}
    ).select('_id first_name last_name full_name resize_profile_image role user_address user_country user_state postal_code user_city membership_type slug');

    return memberList;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

const searchMinistry = async (chruchId,name, pageNo) => {
  try {
    const chruchMinistriesList = await userModel
        .find({
          $and: [
            { parent_id: chruchId },
            {
              role: 'ministries'
            },
            {
              full_name: {
                $regex: name,
                $options: '$i',
              },
            },
          ],
        })
        .select('_id first_name last_name full_name resize_profile_image role user_address user_country user_state postal_code user_city membership_type slug')

    return { chruchMinistriesList: chruchMinistriesList, totalMinistries: 100 };
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Friends not found');
  }
};

module.exports = {
  getFriendById,
  suggestionFriendsList,
  sendReqest,
  cancelRequest,
  removeFriendFromList,
  acceptRequest,
  memberFriendList,
  friendDetails,
  friendRequestList,
  searchFriends,
  friendProfileDetails,
  tagFriendList,
  assignRole,
  memberRequestList,
  acceptMemberRequest,
  memberList,
  searchMembers,
  leaderList,
  searchLeaders,
  ministryList,
  searchMinistry
};
