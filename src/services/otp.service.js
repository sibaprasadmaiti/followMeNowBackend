
const httpStatus = require('http-status');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const { Otp,User } = require('../models');
const smartOtp=require('smart-otp');

const generateResetPasswordOTP = async (email,message) => {
    const user = await userService.getUserByEmail(email);
    if (user) {
      await deleteByEmailOtp(email);
      const otp=smartOtp(6);
      // const otp = Math.floor(100000 + Math.random() * 900000);
      await Otp.create({ email, otp });
      return otp;
    }
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
  };

const deleteByEmailOtp = async (email) => {
    return Otp.findOneAndDelete({ email });
  };

const checkOtpVerifiaction = async (email, otp) => {
    const otpVerification = await getVerificationByEmailOtp(email, otp);
    if (otpVerification) {
      return otpVerification;
    }
    throw new ApiError(httpStatus.NOT_FOUND, 'No otp found with this email');
};

const getVerificationByEmailOtp = async (email, otp) => {
    return Otp.findOne({ email, otp });
  };

const resetPassword = async (email, newPassword) => {
    const user = await userService.getUserByEmail(email);
    // console.log("user",user);
    if (user) {
        await deleteByEmailOtp(email);
        return userService.updateUserById(user._id, { password: newPassword });
    }
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
};

module.exports={
    generateResetPasswordOTP,
    checkOtpVerifiaction,
    getVerificationByEmailOtp,
    resetPassword
}