const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const userprofile = require('./user/profile.route');
const friend = require('./user/friend.route');
const post = require('./user/post.route');
const settings = require('./user/settings.route');
const follow = require('./user/follow.route');
const church=require('./church/church.route');
const timeline = require('./user/newsFeed.route');
const albumRoute = require('./user/album.route')
// const docsRoute = require('./docs.route');
const adminAuthRoute = require('./admin/auth.route');
const adminProfileRoute = require('./admin/profile.route');
const adminUserRoute = require('./admin/adminUser.route');
const adminFormFieldRoute = require('./admin/formfield.route');
const adminPageRoute = require('./admin/page.route');


const router = express.Router();

/** User Routes Start  */
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/user-profile',userprofile);
router.use('/friend',friend);
router.use('/post',post);
router.use('/settings',settings);
router.use('/follow',follow);
router.use('/church',church);
router.use('/timeline',timeline);
router.use('/album',albumRoute);
// router.use('/docs', docsRoute);
/** User Routes End  */

/** Admin Routes Start  */
router.use('/admin/auth',adminAuthRoute);
router.use('/admin/profile',adminProfileRoute);
router.use('/admin/user',adminUserRoute);
router.use('/admin/form-field',adminFormFieldRoute);
router.use('/admin/page',adminPageRoute);
/** Admin Routes End  */

module.exports = router;
