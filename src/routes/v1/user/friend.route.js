const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const friendValidation = require('../../../validations');
const router = express.Router();
const friendController = require('../../../controllers/user/friend.controller');
router.use(auth('manageProfile'));

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: User Friends [Milestone 3]
 */

/**
* @swagger
 *  /friend/suggestion-friend-list:
 *    post:
 *      summary: Suggestion Friends List For Member
 *      tags: [Friends]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - chruchId
 *              properties:
 *                chruchId:
 *                  type: string
 *                  description: Member's chruch id
 *              example:
 *                chruchId:
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
router.post('/suggestion-friend-list',friendController.suggestionFriendsList);
/**
* @swagger
 *  /friend/search-friends:
 *    post:
 *      summary: Search Friend List For Member
 *      tags: [Friends]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - chruchId
 *                - name
 *                - pageNo
 *              properties:
 *                chruchId:
 *                  type: string
 *                  description: Member's chruch id
 *                name:
 *                  type: string
 *                  description: Name of the member who you want to search
 *                pageNo:
 *                  type: number
 *                  description: Page number for pagination
 *              example:
 *                chruchId:
 *                name:
 *                pageNo:
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
router.post('/search-friends',friendController.searchFriends);
/**
* @swagger
 *  /friend/send-friend-request:
 *    post:
 *      summary: Send Friend Request
 *      tags: [Friends]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - member
 *                - friend
 *                - request_date
 *              properties:
 *                member:
 *                  type: string
 *                  description: Member's id
 *                friend:
 *                  type: string
 *                  description: Who sending request that will friend's id means which user logged in and sending the request
 *                request_date:
 *                  type: string
 *                  description: Request date
 *              example:
 *                member:
 *                friend:
 *                request_date:
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
router.post('/send-friend-request',friendController.sendFriendReq);
/**
* @swagger
 *  /friend/remove-friendlist:
 *    post:
 *      summary: Remove Friend Request From Friend's list
 *      tags: [Friends]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - member
 *                - friend
 *                - request_date
 *                - is_removed
 *              properties:
 *                member:
 *                  type: string
 *                  description: Member's id
 *                friend:
 *                  type: string
 *                  description: Who sending request that will friend's id
 *                request_date:
 *                  type: string
 *                  description: Requested date
 *                is_removed:
 *                  type: boolean
 *                  description: is_removed
 *              example:
 *                member:
 *                friend:
 *                request_date:
 *                is_removed: true
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
router.post('/remove-friendlist',friendController.removeFriendFromList);
/**
* @swagger
 *  /friend/accept-request:
 *    patch:
 *      summary: Accept Friend Request
 *      tags: [Friends]
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
 *                  description: Friend's id
 *              example:
 *                id:
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
router.patch('/accept-request',friendController.acceptRequest);
/**
* @swagger
 *  /friend/cancel-request/:id:
 *    delete:
 *      summary: Cancel Or Delete Friend Request
 *      tags: [Friends]
 *      
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
router.delete('/cancel-request/:id',friendController.cancelRequest);
/**
* @swagger
 *  /friend/member-friend-list:
 *    get:
 *      summary: Friends List For Member
 *      tags: [Friends]
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
router.get('/member-friend-list',friendController.memberFriendList);
/**
* @swagger
 *  /friend/friend-request-list:
 *    get:
 *      summary: Friends Request List For Member
 *      tags: [Friends]
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
router.get('/friend-request-list',friendController.friendRequestList);
/**
* @swagger
 *  /friend/friend-details:
 *    post:
 *      summary: Friend details
 *      tags: [Friends]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - friendId
 *              properties:
 *                friendId:
 *                  type: string
 *                  description: Member's chruch id
 *              example:
 *                friendId:
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
router.post('/friend-details',friendController.viewFriendDetails);
/**
* @swagger
 *  /friend/friend-profile-details/:friendId:
 *    get:
 *      summary: Friends Profile Details
 *      tags: [Friends]
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
router.get('/friend-profile-details/:friendId',friendController.friendProfileDetails);
/**
* @swagger
 *  /friend/tag-friend-list:
 *    get:
 *      summary: Friends list for tag when create post
 *      tags: [Friends]
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
router.get('/tag-friend-list',friendController.tagFriendList);
/**
* @swagger
 *  /friend/assign-role:
 *    post:
 *      summary: Assign To Ministry Or Leadership
 *      tags: [Friends]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - id
 *                - role
 *              properties:
 *                id:
 *                  type: string
 *                  description: Member's id
 *                role:
 *                  type: string
 *                  description: leadership/ministries
 *              example:
 *                id:
 *                role:
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
router.post('/assign-role',friendController.assignRole);
router.get('/member-request-list',friendController.memberRequestList);
router.post('/accept-member-request',friendController.acceptMemberRequest);
router.get('/member-list',friendController.memberList);
router.post('/search-member',friendController.searchMembers);
router.get('/leader-list',friendController.leaderList);
router.post('/search-leader',friendController.searchLeaders);
router.get('/ministries-list',friendController.ministryList);
router.post('/search-ministries',friendController.searchMinistry);
module.exports = router;