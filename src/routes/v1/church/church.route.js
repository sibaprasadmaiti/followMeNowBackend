const express = require('express');
const router = express.Router();
// const auth = require('../../../middlewares/auth');

const churchController=require('../../../controllers/church/church.controller')
// router.use(auth('manageProfile'));
/**
 * @swagger
 * tags:
 *   name: Church
 *   description: [Milestone 3]
 */


router.get('/profile/:slug',churchController.churchProfile);
router.get('/member-follow-count/:slug',churchController.memberAndFollowCount);
router.get('/leadership-ministries/:slug',churchController.leadershipAndMinistries);
router.get('/photo-video/:slug',churchController.photoAndVideo);
router.get('/all-photos/:slug',churchController.allPhotos);
router.get('/all-videos/:slug',churchController.allVideos);
router.get('/members/:slug',churchController.memberList);

module.exports = router;