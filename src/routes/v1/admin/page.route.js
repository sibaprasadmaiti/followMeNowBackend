const express = require('express');
const auth = require('../../../middlewares/auth');
const validate = require('../../../middlewares/validate');
const pageValidation = require('../../../validations/page.validation');
const pageController = require('../../../controllers/admin/page.controller');
const uploadPageFile = require('../../../middlewares/postImageUpload.middleware');

const router = express.Router();
router.use(auth('manageAdmin'));

router.get('/get-pages/:currentPage/:limit', validate(pageValidation.getAllPage), pageController.getPageList);
router.post('/add-page', validate(pageValidation.addPage), uploadPageFile('page'), pageController.addPage);
router.get('/edit-page/:id', validate(pageValidation.editPage), pageController.editPage);
router.patch('/update-page/:id', validate(pageValidation.updatePage), uploadPageFile('page'), pageController.updatePage);
router.patch('/status/:id', validate(pageValidation.statusUpdate), pageController.updatePage);
router.delete('/delete-page/:id', validate(pageValidation.deletePage), pageController.deletePage);

module.exports = router;