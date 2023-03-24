const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const settingsModel = require('../models/settings.model');

const generteSettings = async (body) => {
    try {
        const createData = await settingsModel.create({ user: body });
        return createData;
    } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
    }
}

const updateSettings = async (body) => {
    try {
        const updateData = await settingsModel.updateOne({ user: body.user }, body);
        return updateData;
    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
    }
}

const getMemberSettings = async (userId) => {
    try {
        const details = await settingsModel.findOne({ user: userId });
        return details;
    } catch (error) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
    }
}
module.exports = {
    generteSettings,
    updateSettings,
    getMemberSettings
}