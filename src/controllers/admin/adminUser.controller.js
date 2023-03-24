const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const adminUserService = require('../../services/adminUser.service');
const UserService =require('../../services/user.service')

const userList = catchAsync(async(req,res)=>{
    const current_page = req.params.current_page ? req.params.current_page : 1;
    const limit = req.params.limit ? req.params.limit : 8;
    const userList = await adminUserService.getAllUsersList(current_page,limit);
    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: 'Success',
      },
      userData: userList,
    });
})


/* Add user by admin */
const addUser = catchAsync(async (req, res) => {
  if (req.user.role == 'admin') {
    const user = await adminUserService.addUserByAdmin(req.body);
    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: 'User added successfully!',
      },
      result: {
        userData: user,
      },
    });
  } else {
    throw new ApiError(httpStatus.FORBIDDEN, 'You dont have permission to manage users');
  }
});
// Edit User
const editUser = catchAsync(async (req, res) => {
    const user = await UserService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: 'Success',
      },
      result: {
        userData: user,
      },
    });
  });
  
  // Update User
  const updateUser = catchAsync(async (req, res) => {
    const user = await UserService.updateUserById(req.params.id, req.body);
    res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
        message: 'User Data update successfullly',
      },
      result: {
        userData: user,
      },
    });
  });
/* Delete User */
const deleteUser = catchAsync(async (req, res) => {
    const results = await adminUserService.deleteUserById(req.params.userId);
    if (results) {
      res.status(httpStatus.OK).send({
        serverResponse: {
          code: httpStatus.OK,
          message: 'User deleted successfully',
        },
      });
    }else{
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  });
  
  // Block User
  const blockUser = catchAsync(async (req, res) => {
    const data = req.body;
    const user = await adminUserService.blockUserById(req.params.userId, data);
    if (user) {
      const ustatus=user.status;
      if (ustatus == true) {
        message = 'User Un-Blocked Successfully!';
      } else {
        message = 'User Blocked Successfully!';
      }
      res.status(httpStatus.OK).send({
        serverResponse: {
          code: httpStatus.OK,
           message: message,
        }
      });
    }else{
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
  });
module.exports={
    userList,
    addUser,
    deleteUser,
    blockUser,
    editUser,
    updateUser
}