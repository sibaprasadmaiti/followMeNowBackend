const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const router = express.Router();
const albumController = require('../../../controllers/user/album.controller');
const postUpload = require('../../../middlewares/postImageUpload.middleware')
const checkAlbum = require('../../../middlewares/checkAlbum.middleware')
router.use(auth('manageProfile'));

//*** Album Route Start*/
router.post('/album-create',checkAlbum(), postUpload("post_url","post_file"),albumController.albumCreate);
router.post('/album-update',albumController.albumUpdate); 
router.get('/album-pics-list',albumController.albumList); 
router.get('/initail-album-list',albumController.initialAlbumList); //post create time dropdown
router.get('/album-details/:albumId',albumController.albumDetials); 
router.get('/one-album-view',albumController.oneAlbumView); //For album view with one image : Work In Progress
//*** Album Route End*/

module.exports = router;