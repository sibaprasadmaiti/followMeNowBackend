const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const postModel = require('../models/posts.model');
const userModel = require('../models/user.model');
const postCommentModel = require('../models/postComments.model');
const friendModel = require('../models/friends.model');
const postService = require('../services/post.service');

const newsFeed = async (memberId, pageNo = 1) => {
  const limit = 5;
  let skip = 0;
  if (pageNo > 1) skip = (parseInt(pageNo) - 1) * limit;

  const friends = await friendModel.find(
    { $or: [{ member: memberId }, { friend: memberId }], is_friend: true },
    { member: 1, friend: 1 }
  );

  const friendIds = await friends.map((item) => {
    if (item.member.toString() == memberId.toString()) {
      return item.friend.toString();
    } else if (item.friend.toString() == memberId.toString()) {
      return item.member.toString();
    }
  });

  friendIds.push(memberId.toString());

  const data = await postModel
    .find({ member: { $in: friendIds}, type: {$ne: "album"} })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate({
      path: 'member',
      select: 'full_name slug resize_profile_image gender',
    })
    .populate({
      path: 'post_tag_friends.tagged_member_id',
      select: 'full_name resize_profile_image slug  _id',
    })
    .populate({
      path: 'post_like.like_by_member',
      select: 'full_name resize_profile_image slug _id',
    });

  const dataSet = await Promise.all(
    data.map(async (post) => {
      const likesCount = post.post_like.length;
      const tagFriendsCount = post.post_tag_friends.length;

      const [totalCommentCount, tagFriendArray, likeFriendsArray] = await Promise.all([
        postCommentModel.find({ postId: post._id }).countDocuments(),
        post?.post_tag_friends.map((item) => {
          const tagFrndObj = {
            id: item?.id,
            friendId: item?.tagged_member_id?._id,
            friendName: item?.tagged_member_id?.full_name,
            friend_profile_image: item?.tagged_member_id?.resize_profile_image,
            slug: item?.tagged_member_id?.slug,
          };
          return tagFrndObj;
        }),
        post.post_like.map((item) => {
          const likeFrndObj = {
            id: item?._id,
            friendId: item?.like_by_member?._id,
            friendName: item?.like_by_member?.full_name,
            emoji_type: item?.emoji_type,
            friend_profile_image: item?.like_by_member?.resize_profile_image,
            slug: item?.like_by_member?.slug,
          };
          return likeFrndObj;
        }),
      ]);

      let title = ""
      
      if(post?.type && (post?.type == 'cover' || post?.type == 'profile')){
          title = `update ${post?.member?.gender == 'MALE' ? 'his' : 'her'} ${post?.type} picture`
      }

      let details = {
        postId: post?._id,
        title: title,
        authorName: post?.member?.full_name,
        authorSlug: post?.member?.slug,
        authorProfileImage: post?.member?.resize_profile_image,
        caption: post?.caption,
        location: post?.location,
        createdAt: post?.createdAt,
        post_file: post?.post_file,
        tagFriendArray,
        likeFriendsArray,
        likesCount: likesCount,
        tagFriendsCount: tagFriendsCount,
        totalCommentCount: totalCommentCount,
      };

      return details;
    })
  );

  return dataSet;
};

const timeLineSearch = async (body) => {
  const users = await userModel
    .find({ full_name: { $regex: body.search, $options: 'i' } }, { parent_id: body.churchId })
    .select('_id full_name resize_profile_image');
  let friendsArray = [];

  if (users.length > 0) {
    for (let user of users) {
      let alreadyFriend = '';
      const friendAlready = await friendModel.findOne({
        $or: [{ member: user._id }, { friend: user._id }],
        is_friend: true,
      });

      if (!friendAlready) {
        alreadyFriend = false;
      }
      if (friendAlready) {
        alreadyFriend = true;
      }

      friendsArray.push({
        friendId: user._id,
        friendName: user.full_name,
        friendProfileImage: user.resize_profile_image,
        alreadyFriend,
      });
    }

    return friendsArray;
  }
};

module.exports = {
  newsFeed,
  timeLineSearch,
};
