const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const UserService =require('../services/user.service')

// Get Users List
const getAllUsersList = async(currentPage, limit) => {
    try {
        const totalItems = await User.find({ role: 'user' }).countDocuments();
        const users = await User.find({ role: 'user' })
            .sort({ createdAt: -1 })
            .skip((currentPage - 1) * limit)
            .limit(limit);
        const usersList = {
            users,
            page: currentPage,
            limit: limit,
            totalPages: Math.ceil(totalItems / limit),
            totalResults: totalItems,
        };
        return usersList;
    } catch (err) {
        if (err) {
            return new ApiError(httpStatus.NOT_FOUND, 'Users not found');
        }
    }
};

// Add user by admin
const addUserByAdmin = async(userBody) => {
    if (await User.isEmailTaken(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const user = await User.create(userBody);
    return user;
}


const deleteUserById = async(userId) => {
    const user = await UserService.getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
    return user;
};

//  Block User
const blockUserById = async(uid, updateData) => {
    const user = await UserService.getUserById(uid);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    Object.assign(user, updateData);
    await user.save();
    return user;
}
module.exports={
    getAllUsersList,
    addUserByAdmin,
    deleteUserById,
    blockUserById
}