const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    fullname: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin', 'guest'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const addUser = {
  body: Joi.object().keys({
    fullname: Joi.string().required(),
    phone: Joi.number().required(),
    profileimageurl: Joi.optional(),
    email: Joi.string().required(),
    password: Joi.string().required().custom(password),
  }),
};
// const updateUser = {
//   params: Joi.object().keys({
//     userId: Joi.required().custom(objectId),
//   }),
//   body: Joi.object()
//     .keys({
//       email: Joi.string().email(),
//       password: Joi.string().custom(password),
//       name: Joi.string(),
//     })
//     .min(1),
// };

// Update User
const updateUser = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string().optional(),
    email: Joi.string().required(),
    gender: Joi.string().optional(),
    dob: Joi.string().optional(),
    contact_mobile: Joi.string().required(),
    user_address: Joi.string().required(),
    user_country: Joi.string().optional(),
    parent_id: Joi.string().optional(),
    user_state: Joi.optional(),
    user_city: Joi.optional(),
    postal_code: Joi.optional(),
    marital_status: Joi.optional(),
    about_you: Joi.optional(),
    profileimageurl: Joi.optional(),
    agegroup_id: Joi.string().optional(),
    denomination: Joi.string().optional(),
  }),
};
// Update User General Information
const updateGeneralInfo = {
  body: Joi.object().keys({
    education: Joi.string().optional(),
    work_information: Joi.string().optional(),
    hobbies: Joi.string().optional(),
    interested_in: Joi.string().optional(),
    about_you: Joi.string().required(),
  }),
};
const profileImage = {
  body: Joi.object().keys({
    profile_image_url: Joi.optional(),
  }),
};
const coverImage = {
  body: Joi.object().keys({
    cover_image: Joi.optional(),
  }),
};
const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
const changePassword = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateGeneralInfo,
  profileImage,
  coverImage,
  deleteUser,
  changePassword,
};
