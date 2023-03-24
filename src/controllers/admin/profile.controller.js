const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { userService } = require('../../services');


/* Edit Admin Profile */
const editProfile=catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: 'Success',
      },
      userData: user
    });
  });
  
  /* Update Admin Profile */
  const updateProfile = catchAsync(async (req, res) => {
    const user = await userService.updateUserById(req.user.id, req.body);
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
  
  // Change Password
  const changePassword = catchAsync(async (req, res) => {
    await userService.changePassword(req.body.email, req.body.oldPassword, req.body.newPassword);
    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: 'Your password has been changed successfully.',
      },
    });
  });

  module.exports={
    editProfile,
    updateProfile,
    changePassword
  }