const Page = require("../models/page.model")
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const getPageList = async(currentPage, limit) => {
    try {
        let totalItems = await Page.find().countDocuments();
        let pages = await Page.find().populate('user')
            .sort({ created_at: -1 })
            .skip((currentPage - 1) * limit)
            .limit(limit);
        return {
            pages,
            page: currentPage,
            limit: limit,
            totalPages: Math.ceil(totalItems / limit),
            totalResults: totalItems,
        };
    } catch (err) {
        if (err) {
            throw err;
        }
    }
}

const getPageById = async(pageId) => {
    try {
        const pages = await Page.findById(pageId)
        return pages
    } catch (err) {
        if (err) {
            throw new ApiError(httpStatus.NOT_FOUND, "Page Not Found");
        }
    }
}

const updatePage = async(pageid, data) => {
    try {
        await Page.findByIdAndUpdate(pageid, data)
        return
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unable To Update Page")
    }
}

const addPage = async(req) => {
    try {
        let data = {...req.body, user: req.user.id }
        await Page.create(data);
        return true;
    } catch (error) {
        console.log(error)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unable To Create Page")
    }
}

const updatePageStatus = async(status, pageid) => {
    try {
        const updateData = await Page.findById(pageid)
        updateData.is_active = status
        await updateData.save()
        return
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unable To Update Status")
    }
}

const removePageById = async(pageid) => {
    const remove = await Page.findByIdAndDelete(pageid)
    if (!remove) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Can Not Remove Page")
    }
    return remove
}
const getPageBySlug = async(slug) => {
    try {
        const pages = await Page.find({ slug })
        return pages
    } catch (err) {
        if (err) {
            throw new ApiError(httpStatus.NOT_FOUND, "Page Not Found");
        }
    }
}

const pageDetailsBySlug = async(slug) =>{
    try{
        const details = await Page.findOne({slug:slug})
        return details;
    }catch(err){
        throw new ApiError(httpStatus.NOT_FOUND, "Page Not Found");
    }
}


module.exports = {
    removePageById,
    getPageList,
    getPageById,
    updatePage,
    updatePageStatus,
    addPage,
    getPageBySlug,
    pageDetailsBySlug
}