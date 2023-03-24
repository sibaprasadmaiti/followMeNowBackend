const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

// Update Admin
const updateAdmin = {
    body: Joi.object().keys({
      fullname: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      profileimageurl: Joi.optional(),
    }),
  };

  const login = {
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  };
  
  const logout = {
    body: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
  };
  
  const refreshTokens = {
    body: Joi.object().keys({
      refreshToken: Joi.string().required(),
    }),
  };

const forgotPassword = {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
    }),
  };
  
const resetPassword = {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().custom(password),
    }),
  };
module.exports={
    updateAdmin,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword
}