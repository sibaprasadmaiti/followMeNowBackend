const FormField = require("../models/formField.model")
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');


const getFormFieldList = async(currentFormField, limit) => {
    try {
        let totalItems = await FormField.find().countDocuments();
        let formFields = await FormField.find().populate('user')
            .sort({ created_at: -1 })
            .skip((currentFormField - 1) * limit)
            .limit(limit);
        return {
            formFields,
            formField: currentFormField,
            limit: limit,
            totalFormFields: Math.ceil(totalItems / limit),
            totalResults: totalItems,
        };
    } catch (err) {
        if (err) {
            throw err;
        }
    }
}
const getAllFormFieldList = async(currentFormField, limit) => {
    try {
        let formFields = await FormField.find({ is_active: true })
        // console.log("formFields===",formFields);
        return formFields
    } catch (err) {
        if (err) {
            throw err;
        }
    }
}

const getFormFieldById = async(FormFieldId) => {
    try {
        const FormFields = await FormField.findById(FormFieldId)
        return FormFields
    } catch (err) {
        if (err) {
            throw new ApiError(httpStatus.NOT_FOUND, "FormField Not Found");
        }
    }
}
const getFormFieldByIds = async(FormFieldIds) => {
    try {
        const FormFields = await FormField.find({ _id: { $in: FormFieldIds } })
        return FormFields
    } catch (err) {
        if (err) {
            throw new ApiError(httpStatus.NOT_FOUND, "FormFields Not Found");
        }
    }
}

const updateFormField = async(id, data) => {
    try {
        let formField = await getFormFieldById(id);
        if (data.hasOwnProperty('title')) {
            formField.title = data.title;
        }
        if (data.hasOwnProperty('is_active')) {
            formField.is_active = data.is_active;
        }
        if (data.hasOwnProperty('formField')) {
            formField.formField = data.formField;
        }
        formField.save();
        return
    } catch (error) {
        console.log(error)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unable To Update FormField")
    }
}

const addFormField = async(req) => {
    try {
        //let data = {...req.body, user: req.user.id }
        let data = {...req.body, user: req.user.id }
        await FormField.create(data);
        return true;
    } catch (error) {
        console.log(error)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unable To Create FormField['Form field name is unique try with different name']")
    }
}

const updateFormFieldStatus = async(status, FormFieldid) => {
    try {
        const updateData = await FormField.findById(FormFieldid)
        updateData.is_active = status
        await updateData.save()
        return
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unable To Update Status")
    }
}

const removeFormFieldById = async(FormFieldid) => {
    const remove = await FormField.findByIdAndDelete(FormFieldid)
    if (!remove) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Can Not Remove FormField")
    }
    return remove
}
const getFormFieldBySlug = async(slug) => {
    try {
        const FormFields = await FormField.find({ slug })
        return FormFields
    } catch (err) {
        if (err) {
            throw new ApiError(httpStatus.NOT_FOUND, "FormField Not Found");
        }
    }
}

module.exports = {
    removeFormFieldById,
    getFormFieldList,
    getFormFieldById,
    updateFormField,
    updateFormFieldStatus,
    addFormField,
    getFormFieldBySlug,
    getAllFormFieldList,
    getFormFieldByIds
}
