const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const {User} = require('../models');

const adminSignin= async (email, password) => {
    const admin = await getAdminByEmail(email,'admin');
    if(!admin){
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Please enter a valid email!');
    }
    if (!(await admin.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password!');
    }
    // if (admin.role !='admin') {
    //     throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid role!');
    // }
    return admin;
};

const getAdminByEmail = async (email,role) => {
    return User.findOne({ email,role });
};

const adminSignOut= async (refreshToken) => {
    const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.remove();
};

const updateUserByEmail = async (email, updateData) => {
  const user = await getAdminByEmail(email,'admin');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // Object.assign(user, updateData);
  // await user.save();
  return user;
};

module.exports={
    adminSignin,
    adminSignOut,
    getAdminByEmail,
    updateUserByEmail
}