const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/user/auth.controller');
const multer = require('multer');
const upload = multer();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication [Milestone 1]
 */

/**
 * @swagger
 *  /auth/register:
 *    post:
 *      summary: Register as user
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - first_name
 *                - email
 *                - password
 *                - membership_type
 *                - role
 *              properties:
 *                first_name:
 *                  type: string
 *                last_name:
 *                  type: string
 *                parent_id:
 *                  type: string
 *                admin_id:
 *                  type: string
 *                agegroup_id:
 *                  type: string
 *                membership_type:
 *                  type: string
 *                email:
 *                  type: string
 *                  format: email
 *                  description: must be unique
 *                password:
 *                  type: string
 *                  format: password
 *                user_type:
 *                  type: number
 *                trustee_board:
 *                  type: string
 *                gender:
 *                  type: string
 *                marital_status:
 *                  type: boolean
 *                dob:
 *                  type: string
 *                contact_person:
 *                  type: string
 *                contact_mobile:
 *                  type: string
 *                contact_alt_mobile:
 *                  type: string
 *                alt_email:
 *                  type: string
 *                  format: email
 *                website:
 *                  type: string
 *                reset_password:
 *                  type: string
 *                user_address:
 *                  type: string
 *                user_country:
 *                  type: string
 *                user_state:
 *                  type: string
 *                user_city:
 *                  type: string
 *                postal_code:
 *                  type: string
 *                profile_image_url:
 *                  type: string
 *                cover_image:
 *                  type: string
 *                about_you:
 *                  type: string
 *                other_name:
 *                  type: string
 *                interested_in:
 *                  type: string
 *                user_language:
 *                  type: string
 *                favorite_quote:
 *                  type: string
 *                notification_data:
 *                  type: string
 *                place_live_data:
 *                  type: string
 *                is_admin:
 *                  type: boolean
 *                admin_create_date:
 *                  type: string
 *                role:
 *                  type: string
 *                is_approved:
 *                  type: boolean
 *                status:
 *                  type: boolean
 *                is_deleted:
 *                  type: boolean
 *                social_id:
 *                  type: string
 *                user_login_type:
 *                  type: string
 *                is_verified:
 *                  type: boolean
 *              example:
 *                first_name: Test name
 *                email: test@example.com
 *                password: P23456
 *                membership_type: CM
 *                role: user
 *      responses:
 *        "201":
 *          description: Created
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
router.post('/register', validate(authValidation.register), authController.register);
/**
 * @swagger
 *  /auth/churchList:
 *    post:
 *      summary: Church List
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - first_name
 *              properties:
 *                first_name:
 *                  type: string
 *              example:
 *                first_name: Test name
 *      responses:
 *        "201":
 *          description: Feched
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
router.post('/churchList', validate(authValidation.churchList), authController.churchList);
/**
* @swagger
 *  /auth/login:
 *    post:
 *      summary: Login
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                password:
 *                  type: string
 *                  format: password
 *              example:
 *                email: test@example.com
 *                password: password1
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
router.post('/login', validate(authValidation.login), authController.login);
/**
 * @swagger
 *  /auth/logout:
 *    post:
 *      summary: Logout
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - refreshToken
 *              properties:
 *                refreshToken:
 *                  type: string
 *              example:
 *                refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *      responses:
 *        "200":
 *          description: OK
 *        "404":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.post('/logout', validate(authValidation.logout), authController.logout);
/**
 * @swagger
 *  /auth/refresh-tokens:
 *    post:
 *      summary: Refresh Tokens
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - refreshToken
 *              properties:
 *                refreshToken:
 *                  type: string
 *              example:
 *                refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg
 *      responses:
 *        "200":
 *          description: OK
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.post('/refresh-tokens', validate(authValidation.refreshTokens), authController.refreshTokens);
/**
 * @swagger
 *  /auth/forgot-password:
 *    post:
 *      summary: Forgot Password
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *              properties:
 *                email:
 *                  type: string
 *              example:
 *                email: test@example.com
 *      responses:
 *        "200":
 *          description: OK
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.post('/forgot-password', upload.none(), validate(authValidation.forgotPassword), authController.forgotPassword);
/**
 * @swagger
 *  /auth/reset-password:
 *    post:
 *      summary: Reset Password
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - newPassword
 *                - forgotToken
 *              properties:
 *                newPassword:
 *                  type: string
 *                forgotToken:
 *                  type: string
 *              example:
 *                newPassword: Ps#12354
 *                forgotToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2FkYTllNzRmODI2ODUxN2NmOTc2NWEiLCJpYXQiOjE2NzQ3NTI4ODQsImV4cCI6MTY3NDc1MzQ4NCwidHlwZSI6InJlc2V0UGFzc3dvcmQifQ.vD1KjJkxCa62gdyqehGcECLuDnn-IUiIuRM-YSe7EZw
 *      responses:
 *        "200":
 *          description: OK
 *        "400":
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 */
router.post('/reset-password', upload.none(), validate(authValidation.resetPassword), authController.resetPassword);
/**
 * @swagger
 *  /auth/age-group-details:
 *    post:
 *      summary: Age Group Details
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - age
 *              properties:
 *                age:
 *                  type: string
 *              example:
 *                age: 31
 *      responses:
 *        "200":
 *          description: Age Group
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
router.post('/age-group-details', validate(authValidation.ageGroup), authController.ageGroupDetails);
/**
* @swagger
 *  /auth/user-profile-details/:slug:
 *    get:
 *      summary: User Profile Details
 *      tags: [Auth]
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
router.get('/user-profile-details/:slug',authController.userProfileDetails);
/**
 * @swagger
 *  /auth/followers-following-count:
 *    post:
 *      summary: Followers and following count of a member
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - id
 *              properties:
 *                id:
 *                  type: string
 *              example:
 *                id: 
 *      responses:
 *        "200":
 *          description: Followers and following count of a member
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
router.post('/followers-following-count', authController.followerFollowingCount);
/**
* @swagger
 *  /auth/user-type-details/:slug:
 *    get:
 *      summary: User Membership Type and Gender
 *      tags: [Auth]
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
router.get('/user-type-details/:slug',authController.userTypeDetails);
/**
* @swagger
 *  /auth/user-personal-info/:slug:
 *    get:
 *      summary: User Profile Information
 *      tags: [Auth]
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
router.get('/user-personal-info/:slug',authController.getUserPersonalInfo);
/**
 * @swagger
 *  /auth/search-denomination:
 *    post:
 *      summary: Denomination List
 *      tags: [Auth]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - title
 *              properties:
 *                title:
 *                  type: string
 *              example:
 *                title:
 *      responses:
 *        "201":
 *          description: Feched
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
router.post('/search-denomination', authController.searchDenomination);
module.exports = router;

