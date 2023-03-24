const express = require('express');
const validate = require('../../../middlewares/validate');
const profileController = require('../../../controllers/user/profile.controller');
const auth = require('../../../middlewares/auth');
const userValidation = require('../../../validations/user.validation');
const adminValidation = require('../../../validations/admin.validation');
//const imageUploader = require('../../../middlewares/imageUpload');
const imageUploader = require('../../../middlewares/imageUploader');
const router = express.Router();
router.use(auth('manageProfile'));
const multer = require('multer');
const s3Uploader = require('../../../middlewares/formDataImageUpload');
const imageResize = require('../../../services/resizeImage.service');
const upload = multer();
/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User Profile [Milestone 2]
 */

/**
* @swagger
 *  /user-profile/view-profile:
 *    get:
 *      summary: View Profile
 *      tags: [Profile]
 *      responses:
 *        "200":
 *          description: OK
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "401":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.get('/view-profile', profileController.viewProfile);
/**
 * @swagger
 *  /user-profile/update-profile:
 *    patch:
 *      summary: Update Profile
 *      tags: [Profile]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - first_name
 *                - last_name
 *                - email
 *                - gender
 *                - dob
 *                - contact_mobile
 *                - user_address
 *                - user_country
 *              properties:
 *                first_name:
 *                  type: string
 *                last_name:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                gender:
 *                  type: string
 *                dob:
 *                  type: string
 *                contact_mobile:
 *                  type: string
 *                user_address:
 *                  type: string
 *                user_country:
 *                  type: string
 *              example:
 *                first_name: Test name
 *                last_name: Test name
 *                email: test@example.com
 *                gender: MALE
 *                dob: 1995-05-12
 *                contact_mobile: 7897575758
 *                user_address: Dum Dum kolkata
 *                user_country: India
 *      responses:
 *        "201":
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.patch('/update-profile', upload.none(), validate(userValidation.updateUser), profileController.updateProfile);
/**
 * @swagger
 *  /user-profile/update-general-info:
 *    patch:
 *      summary: Update General Information
 *      tags: [Profile]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - education
 *                - work_information
 *                - hobbies
 *                - interested_in
 *                - about_you
 *              properties:
 *                education:
 *                  type: string
 *                work_information:
 *                  type: string
 *                hobbies:
 *                  type: string
 *                interested_in:
 *                  type: string
 *                about_you:
 *                  type: string
 *              example:
 *                education: B.tech
 *                work_information: Shanvi Infotech
 *                hobbies: Coding
 *                interested_in: Coding
 *                about_you: I'm a Software Developer
 *      responses:
 *        "201":
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.patch('/update-general-info', profileController.updateGeneralInfo);
/**
 * @swagger
 *  /user-profile/update-profile-image:
 *    patch:
 *      summary: Update Profile Image
 *      tags: [Profile]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - profile_image_url
 *              properties:
 *                profile_image_url:
 *                  type: string
 *                  format: file
 *                  description: image file
 *              example:
 *                profile_image_url:
 *      responses:
 *        "201":
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.patch('/update-profile-image',s3Uploader.uploadS3ProfileImage.single('profile_image_url'), profileController.updateProfileImage);
/**
 * @swagger
 *  /user-profile/update-cover-image:
 *    patch:
 *      summary: Update Profile Cover Image
 *      tags: [Profile]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - cover_image
 *              properties:
 *                cover_image:
 *                  type: string
 *                  format: file
 *                  description: image file
 *              example:
 *                cover_image:
 *      responses:
 *        "201":
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.patch('/update-cover-image',s3Uploader.uploadS3CoverImage.single('cover_image'), validate(userValidation.coverImage), profileController.updateCoverImage);
/**
 * @swagger
 *  /user-profile/change-password:
 *    post:
 *      summary: Change Password
 *      tags: [Profile]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - oldPassword
 *                - newPassword
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                oldPassword:
 *                  type: string
 *                  description: old password
 *                newPassword:
 *                  type: string
 *                  description: old password
 *              example:
 *                email: test@example.com
 *                oldPassword: Ps#12354
 *                newPassword: Ps#12353
 *      responses:
 *        "201":
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.post('/change-password', upload.none(), validate(userValidation.changePassword), profileController.changePassword);

module.exports = router;
