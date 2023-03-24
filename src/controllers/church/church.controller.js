'use strict';
const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const churchService = require('../../services/church.service');
const messageDir = require('../../utils/messageDir');

const churchProfile = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const data = await churchService.churchProfile(slug);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success,
    },
    data,
  });
});

const memberAndFollowCount = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const data = await churchService.memberAndFollowCount(slug);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success,
    },
    data,
  });
});

const leadershipAndMinistries = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const data = await churchService.leadershipAndMinistries(slug);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success,
    },
    data,
  });
});

const photoAndVideo = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const data = await churchService.photoAndVideo(slug);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success,
    },
    data,
  });
});

const allPhotos = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const data = await churchService.allPhotos(slug);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success,
    },
    data,
  });
});

const allVideos = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const data = await churchService.allVideos(slug);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success,
    },
    data,
  });
});

const memberList = catchAsync(async (req, res) => {
    const slug = req.params.slug;
    const data = await churchService.memberList(slug);
    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: messageDir.message.success,
      },
      data,
    });
  });

module.exports = {
  churchProfile,
  memberAndFollowCount,
  leadershipAndMinistries,
  photoAndVideo,
  allPhotos,
  allVideos,
  memberList
};
