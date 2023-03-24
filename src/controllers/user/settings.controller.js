'use strict';
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const settingsService = require('../../services/settings.service');

const settingsGenerate = catchAsync(async (req, res) => {
  const body = req.body;
  const settingsGenerate = await settingsService.generteSettings(body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Success',
    }
  });
})

const settingsUpdate = catchAsync(async (req, res) => {
  const body = req.body;
  const settingsUpdate = await settingsService.updateSettings(body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Profile setting updated successfullly',
    }
  });
})

const getMemberSettings = catchAsync(async (req, res) => {
  const userId = req.user.id;console.log(userId);
  const settingsDetails = await settingsService.getMemberSettings(userId);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Success',
    },
    settingsDetails
  });
})
module.exports = {
  settingsGenerate,
  settingsUpdate,
  getMemberSettings
}