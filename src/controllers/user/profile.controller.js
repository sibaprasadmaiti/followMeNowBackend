const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const userService = require('../../services/user.service');
const resizeImageService = require('../../services/resizeImage.service');
const userModel = require('../../models/user.model');
const postService = require('../../services/post.service');

// const { log } = require('@tensorflow/tfjs');

/* View User Profile */
const viewProfile = catchAsync(async (req, res) => {
  const id = req.user.id;
  const user = await userService.getUserById(id);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Success',
    },
    userData: user.userData,
    completeProfile: user.completeProfile,
    incompleteFields: user.incompleteFields,
  });
});

/* Update User Profile */
const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  let requestBody = req.body;
  // requestBody.profile_image_url = req.file ? req.file.filename : "";
  const user = await userService.updateUserById(userId, requestBody);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Profile updated successfullly',
    },
    result: {
      userData: user,
    },
  });
});

/* Update User General Information */
const updateGeneralInfo = catchAsync(async (req, res) => {
  const userId = req.user.id;
  let requestBody = req.body;
  const user = await userService.updateGeneralInfo(userId, requestBody);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'General information updated successfullly',
    },
    result: {
      userData: user,
    },
  });
});

/* Update User Profile Image */
const updateProfileImage = catchAsync(async (req, res) => {
  const userId = req.user.id;
  let requestBody = await userService.getuserBy_Id(userId);
  requestBody.profile_image_url = req.file.location;
  const postBody = {
    member: userId,
    caption: "",
    type: "profile",
    post_file: [
      {
        post_url:req.file.location
      }
    ],
  }
  const postdata = await postService.createPost(postBody);
  requestBody.postId = postdata._id;
  const user = await userService.updateUserById(userId, requestBody);
  const priviousProfileImage = await userModel.findOne({_id:userId}).select('profile_image_url');
  const resizeImage = await resizeImageService.resizeImage(
    user,
    'profile-image',
    req.file.key,
    `${user._id}` + '/profile-images/resize-image/resize-profile-image.png'
  );
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Profile image updated successfully',
    },
    result: {
      userData: user,
    },
  });
});

/* Update User Cover Image */
const updateCoverImage = catchAsync(async (req, res) => {
  const userId = req.user.id;
  let requestBody = await userService.getuserBy_Id(userId);
  requestBody.cover_image = req.file.location;
  const postBody = {
    member: userId,
    caption: "",
    type:"cover",
    post_file: [
      {
        post_url:req.file.location
      }
    ],
  }
  const postdata = await postService.createPost(postBody);
  requestBody.postId = postdata._id;
  const user = await userService.updateUserById(userId, requestBody);
  const priviousCoverImage = await userModel.findOne({_id:userId}).select('cover_image');
  const resizeImage = await resizeImageService.resizeImage(
    user,
    'cover-image',
    req.file.key,
    `${user._id}` + '/cover-images/resize-image/resize-cover-image.png'
  );

  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Cover image updated successfully',
    },
    result: {
      userData: user,
    },
  });
});

/* Change Password */
const changePassword = catchAsync(async (req, res) => {
  await userService.changePassword(req.body.email, req.body.oldPassword, req.body.newPassword);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Your password has been changed successfully.',
    },
  });
});

module.exports = {
  viewProfile,
  updateProfile,
  updateGeneralInfo,
  updateProfileImage,
  updateCoverImage,
  changePassword,
};
