const express = require('express');
const validate = require('../../../middlewares/validate');
const profileController = require('../../../controllers/admin/profile.controller');
const auth = require('../../../middlewares/auth');
const userValidation = require('../../../validations/user.validation');
const adminValidation = require('../../../validations/admin.validation');
const imageUploader = require('../../../middlewares/imageUpload')
const router = express.Router();
router.use(auth('manageAdmin'));

router.get('/edit-profile/:id', profileController.editProfile);
router.patch('/update-profile',validate(adminValidation.updateAdmin),imageUploader('profileimageurl'), profileController.updateProfile)
router.post('/change-password', validate(userValidation.changePassword), profileController.changePassword);

module.exports = router;