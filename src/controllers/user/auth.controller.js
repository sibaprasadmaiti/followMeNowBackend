'use strict';
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const {
  authService,
  userService,
  tokenService,
  emailService,
  otpService,
  settingService,
  followService,
  albumService
} = require('../../services');
// REGISTER USER API //
const register = catchAsync(async (req, res) => {
  const requestData = req.body;
  const user = await userService.createUser(req.body);
  await settingService.generteSettings(user._id);
  const tokens = await tokenService.generateAuthTokens(user);
  const albumCreate = await albumService.createAlbums(user._id);
  // const mailObj = { email: requestData.email, password: requestData.password, first_name: requestData.first_name };
  emailService.sendMailForUserPassword(requestData.email, requestData.password, requestData.first_name);
  res.status(httpStatus.CREATED).send({
    serverResponse: {
      code: httpStatus.CREATED,
      message: 'You have successfully sign up',
    },
    result: {
      userData: user,
      tokens: {
        accessToken: tokens.access.token,
        refreshToken: tokens.refresh.token,
      },
    },
  });
});
// FETCH CHURCH LIST
const churchList = catchAsync(async (req, res) => {
  const requestData = req.body;
  const churchData = await userService.fetchChurch(requestData);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Church list fetch successfully.',
    },
    result: {
      userData: churchData,
    },
  });
});
// LOGIN USER //
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  const userALbums = await albumService.initialAlbumList(user._id);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'You have successfully sign in',
    },
    result: {
      userData: user,
      userALbums,
      tokens: {
        accessToken: tokens.access.token,
        refreshToken: tokens.refresh.token,
      },
    },
  });
});
// LOGOUT USER //
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Logged out successfully',
    },
  });
});
// REFRESH TOKENS //
const refreshTokens = catchAsync(async (req, res) => {
  // console.log("req.body.refreshToken",req.body.refreshToken);
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  // res.send({ ...tokens });
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Success',
    },
    result: {
      tokens: {
        accessToken: tokens.access.token,
        refreshToken: tokens.refresh.token,
      },
    },
  });
});

// FORGET PASSWORD //
const forgotPassword = catchAsync(async (req, res) => {
  const user = await userService.getUserByEmail(req.body.email);
  if (user) {
    const resetToken = await tokenService.generateResetPasswordToken(user.email);
    const forgotUrl = process.env.FRONTENDURL + '?token=' + resetToken;
    emailService.sendMailForForgotPassword(user.email, forgotUrl);
    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: 'Forgot password link has been sent to your email address!',
      },
    });
  } else {
    res.status(404).send({
      serverResponse: {
        code: 404,
        message: 'Invalid email ID',
      },
    });
  }
});

// RESET PASSWORD GENERATE //
const resetPassword = catchAsync(async (req, res) => {
  const resetPass = await authService.resetPassword(req.body.forgotToken, req.body.newPassword);
  if (resetPass) {
    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: 'Your password has been reset successfully.',
      },
    });
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, 'Password reset failed.');
  }
});

// FETCH AGE GROUP DETAILS
const ageGroupDetails = catchAsync(async (req, res) => {
  const age = req.body.age;
  const ageGroup = await userService.fetchAgeGroup(age);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Age group details fetch successfully.',
    },
    details: ageGroup,
  });
});

// FETCH USER PROFILE PIC, COVER PIC AND NAME
const userProfileDetails = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const userDetails = await userService.userProfileDetails(slug);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Success',
    },
    userDetails,
  });
});

const followerFollowingCount = catchAsync(async (req, res) => {
  const memberId = req.body.id;
  const list = await followService.followerFollowingCount(memberId);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'success',
    },
    list,
  });
});

const userTypeDetails = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const userDetails = await userService.userTypeDetails(slug);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Success',
    },
    userDetails,
  });
});

/* User Personal Information */
const getUserPersonalInfo = catchAsync(async (req, res) => {
  const slug = req.params.slug;
  const userDetails = await userService.getUserPersonalInfo(slug);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Success',
    },
    userDetails: userDetails,
  });
});

const searchDenomination = catchAsync(async (req, res) => {
  const title = req.body.title;
  const list = await userService.searchDenomination(title);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Success.',
    },
    list
  });
});

module.exports = {
  register,
  churchList,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  ageGroupDetails,
  userProfileDetails,
  followerFollowingCount,
  userTypeDetails,
  getUserPersonalInfo,
  searchDenomination
};
