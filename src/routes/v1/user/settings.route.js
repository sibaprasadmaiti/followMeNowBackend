const express = require('express');
const router = express.Router();
const settingsController = require('../../../controllers/user/settings.controller');
const settingValidation = require('../../../validations/setting.validation')
const multer = require('multer');
const validate = require('../../../middlewares/validate');
const upload = multer();

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User Settings [Milestone 3]
 */

/**
 * @swagger
 *  /settings/settings-update:
 *    patch:
 *      summary: Setting Update
 *      tags: [Settings]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - user
 *                - who_access_ur_profile
 *                - follow_me
 *                - send_me_notification
 *                - text_message_to_phone
 *                - tagging
 *                - sount_notification
 *              properties:
 *                user:
 *                  type: string
 *                who_access_ur_profile:
 *                  type: string
 *                follow_me:
 *                  type: boolean
 *                send_me_notification:
 *                  type: boolean
 *                tagging:
 *                  type: boolean
 *                sount_notification:
 *                  type: boolean
 *              example:
 *                user: 63e8d170f3c20839cca47654
 *                who_access_ur_profile: all
 *                follow_me: false
 *                send_me_notification: false
 *                tagging: false
 *                sount_notification: true
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

router.patch('/settings-update', upload.none(), validate(settingValidation.settings), settingsController.settingsUpdate);


/**
* @swagger
 *  /settings/settings-details:
 *    get:
 *      summary: Settings details
 *      tags: [Settings]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
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
router.get('/settings-details', settingsController.getMemberSettings);


module.exports = router;