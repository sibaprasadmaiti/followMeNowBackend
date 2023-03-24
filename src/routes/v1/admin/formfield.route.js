const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const formfieldValidation = require('../../../validations/formfield.validation');
const formFieldController = require('../../../controllers/admin/formField.controller');

const router = express.Router();
router.use(auth('manageAdmin'));

router.get('/get-formfields/:currentPage/:limit', validate(formfieldValidation.getFormFieldList), formFieldController.getFormFieldList);
router.post('/add-formfield', validate(formfieldValidation.addFormField), formFieldController.addFormField);
router.get('/edit/:id', validate(formfieldValidation.edit), formFieldController.editFormField);
router.post('/get-form-fields', validate(formfieldValidation.formdids), formFieldController.getFormFields);
router.patch('/status/:id', validate(formfieldValidation.statusUpdate), formFieldController.updateFormField);
router.patch('/update/:id', validate(formfieldValidation.update), formFieldController.updateFormField);
router.delete('/delete/:id', validate(formfieldValidation.deleteFormfield), formFieldController.deleteFormField);
router.get('/get-all-form-fields-names/', formFieldController.getAllFormField);

module.exports = router;
