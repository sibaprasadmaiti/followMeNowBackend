const express = require('express');
const validate = require('../../../middlewares/validate');
const adminValidation = require('../../../validations/admin.validation');
const adminAuthController = require('../../../controllers/admin/auth.controller');

const router = express.Router();

router.post('/signin', validate(adminValidation.login), adminAuthController.signIn);
router.post('/signout', validate(adminValidation.logout), adminAuthController.signOut);
router.post('/forgot-password-otp', validate(adminValidation.forgotPassword), adminAuthController.forgotPasswordOtp);
router.post('/otp-verification', adminAuthController.otpVerification);
router.post('/reset-password', validate(adminValidation.resetPassword), adminAuthController.resetPassword);

module.exports = router;