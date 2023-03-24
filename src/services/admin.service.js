const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const getUserById = async(id) => {
    return User.findById(id);
};

module.exports={
    getUserById
}