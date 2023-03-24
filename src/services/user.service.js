const httpStatus = require('http-status');
const { User, AgeGroup, Denomination } = require('../models');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const imageUpload = require("../middlewares/base64SingleFileUpload");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "");
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const full_name = `${userBody?.first_name} ${userBody?.last_name ? userBody?.last_name : ''}`
  const slug = slugify(full_name)
  const userCount = await User.count({slug: slug});
  userBody.slug = `${slug}${userCount ? userCount : ""}`

  const user = await User.create(userBody);

  return user;
};

/**
 * Fetch church list
 * @param {Object} userBody
 * @returns {Promise<QueryResult>}
 */
const fetchChurch = async (userBody) => {
  const churchs = await User.find({
    full_name: {
      $regex: userBody.first_name,
      $options: "$i",
    }, status: true, is_deleted: false, membership_type: {$ne : 'RM'}
  }).select("full_name").limit(7);

  return churchs;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<QueryResult>}
 */
const getUserById = async (id) => {
  const userData = await User.findById(id);

  let completeProfile = 0;
  let requiredFields = ['first_name','email','gender','dob','contact_mobile','user_address','user_country','about_you','profile_image_url','cover_image']
  if(userData?.membership_type == 'CM')
    requiredFields = requiredFields.filter(item => item !== 'gender' && item !== 'dob');
  
  for(let rf of requiredFields){
    if(userData[rf] && userData[rf] != "")
    completeProfile += 100/requiredFields.length
  }
  
  userData._doc.parentUserName = ""
  if(userData.parent_id){
    const parentUserDetails = await User.findById(userData.parent_id).select("first_name");
    userData._doc.parentUserName = parentUserDetails?.first_name
  }

  userData._doc.denominationTitle = ""
  if(userData.denomination){
    const denominationDetails = await Denomination.findById(userData.denomination).select("denomination");
    userData._doc.denominationTitle = denominationDetails?.denomination
  }

  completeProfile = Math.round(completeProfile);
  let data = {
    userData: userData._doc,
    completeProfile: completeProfile
  }
  return data;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  // console.log("ussssss",await User.findOne({ email }));
  return await User.findOne({ email }).select("id membership_type email first_name last_name full_name marital_status is_admin is_approved is_deleted is_verified status profile_image_url resize_profile_image resize_cover_image cover_image gender dob user_address user_country parent_id slug password contact_mobile about_you");
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getuserBy_Id(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  // const updatedata = await User.updateOne({ "_id": userId }, updateBody).exec();
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};


const changePassword = async (email, oldPassword, newPassword) => {
  const user = await getUserByEmail(email);
  if (user) {
    const isPassMatch = await bcrypt.compare(oldPassword, user.password);
    const samePassword = await bcrypt.compare(newPassword, user.password);
    if (isPassMatch) {
      if (!samePassword) {
        const changeUpdateUser = await updateUserById(user._id, {
          password: newPassword,
        });
        return changeUpdateUser;
      }
      throw new ApiError(httpStatus.FORBIDDEN, 'Your current password should not same as new password');
    }
    throw new ApiError(httpStatus.FORBIDDEN, 'Old password is incorrect, please try again');
  }
  throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
};

const updateUserByEmail = async (email, updateData) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateData);
  await user.save();
  return user;
};
const getUserBySocialId = async (socialId, loginType) => {
  let qry = {};
  if (loginType === 'apple') {
    qry = {
      socialId: socialId,
    };
  }
  if (loginType === 'google') {
    qry = {
      socialId: socialId,
    };
  }
  return User.findOne(qry);
};

const getuserBy_Id = async(userId) =>{
  return await User.findOne({_id:userId})
}

/**
 * Fetch age group details
 * @param {Object} userBody
 * @returns {Promise<QueryResult>}
 */
const fetchAgeGroup = async (age) => {
  const ageGroupDetails = await AgeGroup.findOne({
    min_age: {$lte: age}, max_age: {$gte: age}, status: true
  },{age_group_name: 1, _id: 1});
  return ageGroupDetails;
};

/**
 * Fetch user profile details details
 * @param {Object} userBody
 * @returns {Promise<QueryResult>}
 */
const userProfileDetails = async (slug) => {
  try {
    const details = await User.findOne(
      {
        slug: slug,
      }
    ).select("_id first_name last_name full_name resize_profile_image user_address user_country user_state user_city postal_code cover_image slug ");

    return details;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const userTypeDetails = async (slug) => {
  try {
    const details = await User.findOne({ slug: slug }).select('membership_type gender slug full_name');
    return details;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const getUserPersonalInfo = async (slug) => {
  const userDetails = await User.findOne({slug: slug}).select("full_name slug email gender dob contact_mobile user_address user_country user_state user_city resize_profile_image about_you createdAt");

  return userDetails;
};

const updateGeneralInfo = async(userId, body)=>{
  try {
    if(body?.our_mission?.image_url){
      const missionImage = await imageUpload(body?.our_mission?.image_url, `${userId}/general-images`)
      body.our_mission.image_url = missionImage
    }
    if(body?.our_vission?.image_url){
      const vissionImage = await imageUpload(body?.our_vission?.image_url, `${userId}/general-images`)
      body.our_vission.image_url = vissionImage
    }
    if(body?.todays_thought?.image_url){
      const todaysThoughtImage = await imageUpload(body?.todays_thought?.image_url, `${userId}/general-images`)
      body.todays_thought.image_url = todaysThoughtImage
    }

    return await User.findByIdAndUpdate(userId, body)
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
}

const searchDenomination = async (title) => {
  const denominationList = await Denomination.find({
    denomination: {
      $regex: title,
      $options: "$i",
    }
  }).select("denomination _id").limit(7);

  return denominationList;
};

module.exports = {
  createUser,
  fetchChurch,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  changePassword,
  updateUserByEmail,
  getUserBySocialId,
  getuserBy_Id,
  fetchAgeGroup,
  userProfileDetails,
  userTypeDetails,
  slugify,
  getUserPersonalInfo,
  updateGeneralInfo,
  searchDenomination
};
