const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @param {string} role
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email');
  }
  if (!(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if (user.is_deleted == true) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are blocked by admin');
  }
  if (!(user.status == true)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are inactive by admin');
  }

  let completeProfile = 0;
  let requiredFields = ['first_name','email','gender','dob','contact_mobile','user_address','user_country','about_you','profile_image_url','cover_image']
  if(user?.membership_type == 'CM')
    requiredFields = requiredFields.filter(item => item !== 'gender' && item !== 'dob');
  
  for(let rf of requiredFields){
    if(user[rf] && user[rf] != "")
    completeProfile += 100/requiredFields.length
  }

  user._doc.iscompleted = completeProfile >= 100 ? true : false
  delete user.password
  delete user.about_you
  delete user.contact_mobile
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    // console.log("user",user);
    if (!user) {
      throw new Error();
    }
    // await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    console.log('errrr', error);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);

    if (!user) {
      throw new Error('User not found');
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    await userService.updateUserById(user.id, { password: newPassword });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error);
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
};
