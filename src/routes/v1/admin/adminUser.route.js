const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const userValidation = require('../../../validations/user.validation');
const imageUploader = require('../../../middlewares/imageUpload');
const adminUserController = require('../../../controllers/admin/adminUser.controller');
const router = express.Router();
router.use(auth('manageAdmin'));

router.get('/get-users/:current_page/:limit?',adminUserController.userList);
router.post('/add-user', validate(userValidation.addUsers), imageUploader('profileimageurl'),  adminUserController.addUser);
router.get('/edit-user/:userId',adminUserController.editUser);
router.patch('/update-user/:id', validate(userValidation.updateUser), imageUploader('profileimageurl'), adminUserController.updateUser);
router.delete('/delete-user/:userId', adminUserController.deleteUser);
router.patch('/block-user/:userId', adminUserController.blockUser);
module.exports = router;