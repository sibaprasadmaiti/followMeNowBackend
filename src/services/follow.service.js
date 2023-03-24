const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const followModel = require('../models/follow.model');
const userModel = require('../models/user.model');

const followerFollowingCount = async (memberId) => {
  try {
    const [following, followers] = await Promise.all([
      followModel.count({ following: memberId }),
      followModel.count({ follower: memberId }),
    ]);

    return { following: following, followers: followers };
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong!');
  }
};

const follow = async (following, follower) => {
  try {
    return await followModel.create({ following, follower });
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong!');
  }
};

const unfollow = async (following, follower) => {
  try {
    const followed = await followModel.findOne({
      following: following,
      follower: follower,
    });

    if (!followed) {
      throw new ApiError(httpStatus.NOT_FOUND, "You haven't followed.");
    }
    return await followModel.remove({ _id: followed._id });
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong!');
  }
};

module.exports = {
  followerFollowingCount,
  follow,
  unfollow,
};
