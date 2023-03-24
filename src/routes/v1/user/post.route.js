const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const postValidation = require('../../../validations');
const router = express.Router();
const postController = require('../../../controllers/user/post.controller');
const postUpload = require('../../../middlewares/postImageUpload.middleware')
router.use(auth('manageProfile'));

//*** Post Route Start*/
router.post('/create-post',postUpload("post_url","post_file"),postController.createPost); //For Create Post
router.post('/get-post-list',postController.postList); //For member own post list
router.post('/like-generate',postController.postLikeGenerate); //Like generate for post
router.post('/post-details',postController.postDetails); //Post details
router.post('/post-delete',postController.postDelete); //Post delete
router.post('/update-post',postUpload("post_url","post_file"),postController.updatePost); //For Update Post

//*** Post Route End*/


//*** Post Comment Route Start*/
router.post('/comment-generate',postController.commentGenerate); //Comment generate for post
router.post('/comment-modify',postController.commentModify); //comment modify for post
router.post('/comment-list',postController.commentList); //Comment list for post
router.post('/comment-like-generate',postController.commentLikeGenerate); //Comment like
router.post('/comment-delete',postController.commentDelete); //Comment delete
//*** Post Route End*/

module.exports = router;