const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const router = express.Router();
const followController = require('../../../controllers/user/follow.controller');
router.use(auth('manageProfile'));

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: User Following/Followers [Milestone 3]
 */

/**
* @swagger
 *  /follow/following-member:
 *    post:
 *      summary: Follow the member
 *      tags: [Follow]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - follower
 *              properties:
 *                follower:
 *                  type: string
 *                  description: Member's id
 *              example:
 *                follower:
 *      responses:
 *        "201":
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
router.post('/following-member',followController.follow);
/**
* @swagger
 *  /follow/unfollow-member:
 *    post:
 *      summary: Unfollow the member
 *      tags: [Follow]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - follower
 *              properties:
 *                follower:
 *                  type: string
 *                  description: Member's id
 *              example:
 *                follower:
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
router.post('/unfollow-member',followController.unfollow);
// /**
// * @swagger
//  *  /follow/followers-following-count:
//  *    get:
//  *      summary: Followers and following count of a member
//  *      tags: [Follow]
//  *      responses:
//  *        "200":
//  *          description: OK
//  *          content:
//  *            application/json:
//  *              schema:
//  *                type: object
//  *        "401":
//  *          content:
//  *            application/json:
//  *              schema:
//  *                type: object
//  */
// router.get('/followers-following-count',followController.followerFollowingCount);
module.exports = router;