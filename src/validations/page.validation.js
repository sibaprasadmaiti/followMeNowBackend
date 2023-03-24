const Joi = require('joi');
const { objectId } = require('./custom.validation');
// get All Page
const getAllPage = {
    params: Joi.object().keys({
        currentPage: Joi.number().required(),
        limit: Joi.number().required(),
    }),
};

// Edit Page
const editPage = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(objectId),
    }),
};

// Add Page
const addPage = {
    body: Joi.object().keys({
        title_en: Joi.string().required(),
        title_ar: Joi.string().required(),
        block: Joi.object().required(),
        formId: Joi.array().required(),
    }),
};

// Update Page
const updatePage = {
    params: Joi.object().keys({
        id: Joi.string().required().custom(objectId),
    }),
    body: Joi.object().keys({
        title_en: Joi.string().required(),
        title_ar: Joi.string().required(),
        block: Joi.object().required(),
        formId: Joi.array().required(),
    }),
};

// Delete Page
const deletePage = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
};

// get Page
const getPage = {
    params: Joi.object().keys({
        slug: Joi.string().required(),
    }),
};
const statusUpdate = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        is_active: Joi.boolean().required(),
    }),
};
module.exports = {
    getAllPage,
    editPage,
    addPage,
    updatePage,
    deletePage,
    getPage,
    statusUpdate
};
