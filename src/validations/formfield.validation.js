const Joi = require('joi');
const getFormFieldList = {
    params: Joi.object().keys({
        currentPage: Joi.number().required(),
        limit: Joi.number().required(),
    }),
};
const addFormField = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        formField: Joi.array().required(),
    }),
};
const edit = {
    params: Joi.object().keys({
        id: Joi.string().required(),

    }),
};
const update = {
    params: Joi.object().keys({
        id: Joi.string().required(),
    }),
    body: Joi.object().keys({
        title: Joi.string().required(),
        formField: Joi.array().required(),
    }),
};
const deleteFormfield = {
    params: Joi.object().keys({
        id: Joi.string().required(),

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
const formdids = {
    body: Joi.object().keys({
        id: Joi.array().required(),
    }),
};
module.exports = {
    getFormFieldList,
    addFormField,
    edit,
    update,
    deleteFormfield,
    statusUpdate,
    formdids
};
