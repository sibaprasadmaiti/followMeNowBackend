const express = require('express');
const auth = require('../../../middlewares/auth');
const router = express.Router();
const newsFeedController = require('../../../controllers/user/newsFeed.controller');
router.use(auth('manageProfile'));

//*** News Feed Route Start*/
router.get('/news-feed',newsFeedController.newsFeed);
router.post('/time-line-search',newsFeedController.timeLineSearch);
//*** News Feed Route End*/

module.exports = router;