'use strict';
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const followService = require('../../services/follow.service');
const messageDir = require('../../utils/messageDir');

// const followerFollowingCount = catchAsync(async (req, res) => {
//   const memberId = req.user.id;
//   const list = await followService.followerFollowingCount(memberId);
//   res.status(httpStatus.OK).send({
//     serverResponse: {
//       code: httpStatus.OK,
//       message: messageDir.message.success,
//     },
//     list,
//   });
// });

const follow = catchAsync(async (req, res) => {
  const follower = req.body.follower;
  const memberId = req.user.id;
  await followService.follow(memberId, follower);
  res.status(httpStatus.CREATED).send({
    serverResponse: {
      code: httpStatus.CREATED,
      message: messageDir.message.success,
    },
  });
});

const unfollow = catchAsync(async (req, res) => {
  const follower = req.body.follower;
  const memberId = req.user.id;
  await followService.unfollow(memberId, follower);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success,
    },
  });
});

module.exports = {
  follow,
  unfollow,
};
