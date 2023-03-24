const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const formfieldService = require('../../services/formfield.service');

/* FormField List */
const getFormFieldList = catchAsync(async(req, res) => {
    const { currentFormField, limit } = req.body;
    const formFieldData = await formfieldService.getFormFieldList(currentFormField, limit)

    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'FormField list',
        },
        formFieldData
    });
});
/**
 * Add FormField
 */
const addFormField = catchAsync(async(req, res) => {
    await formfieldService.addFormField(req)
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'FormField created successfully',
        },
    });
});
/**
 * Edit FormField
 */
const editFormField = catchAsync(async(req, res) => {
    const id = req.params.id;
    const formFeild = await formfieldService.getFormFieldById(id)
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'FormField',
        },
        formFeild
    });
});
/**
 * get FormFields
 */
const getFormFields = catchAsync(async(req, res) => {
    const ids = req.body.id;
    const formFeild = await formfieldService.getFormFieldByIds(ids)
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'FormField',
        },
        formFeild
    });
});
/**
 * Update FormField
 */
const updateFormField = catchAsync(async(req, res) => {
    const id = req.params.id;
    const data = req.body;
    await formfieldService.updateFormField(id, data)
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'FormField updated successfully',
        },
    });
});
/**
 * Delete FormField
 */
const deleteFormField = catchAsync(async(req, res) => {
    const id = req.params.id;
    await formfieldService.removeFormFieldById(id)
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'FormField deleted successfully',
        },
    });
});
/**
 * Get all FormField
 */
const getAllFormField = catchAsync(async(req, res) => {
    let formfields = await formfieldService.getAllFormFieldList()
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'FormField deleted successfully',
        },
        formfields
    });
});

module.exports = {
    getFormFieldList,
    addFormField,
    editFormField,
    updateFormField,
    deleteFormField,
    getAllFormField,
    getFormFields
};
