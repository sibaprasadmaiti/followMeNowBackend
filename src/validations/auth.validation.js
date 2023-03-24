'use strict';
const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().optional(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    membership_type: Joi.string().required().valid('RM', 'CM', 'CC'),
    role: Joi.string().required(),
    agegroup_id: Joi.string().optional(),
    user_type: Joi.string().optional(),
    gender: Joi.string().optional().valid('MALE', 'FEMALE', 'OTHERS'),
    dob: Joi.string().optional(),
    parent_id: Joi.string().optional(),
  }),
};

const churchList = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
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
    forgotToken: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const ageGroup = {
  body: Joi.object().keys({
    age: Joi.number().required(),
  }),
};

module.exports = {
  register,
  churchList,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  ageGroup
};
