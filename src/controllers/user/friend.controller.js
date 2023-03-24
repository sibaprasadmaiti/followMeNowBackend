'use strict';
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const friendService = require('../../services/friend.service');
const messageDir = require('../../utils/messageDir');

const suggestionFriendsList= catchAsync(async(req,res)=>{
  const chruchId= req.body.chruchId;
  const memberId= req.user.id;
  const list= await friendService.suggestionFriendsList(chruchId,memberId);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success
    },
    list
  });
})

const searchFriends= catchAsync(async(req,res)=>{
  const chruchId= req.body.chruchId;
  const memberId= req.user.id;
  const name= req.body.name;
  const pageNo= req.body.pageNo;
  const list= await friendService.searchFriends(chruchId,memberId,name,pageNo);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success
    },
    list
  });
})

const sendFriendReq = catchAsync(async(req,res)=>{
  const body = req.body;
  const addReq = await friendService.sendReqest(body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Success',
    }
    });
})

const cancelRequest = catchAsync(async(req,res)=>{
  const memberId= req.user.id;
  const Id = req.params.id;  //Collection unique Id
  const cancelReq = await friendService.cancelRequest(Id, memberId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    }
  })
})

const removeFriendFromList = catchAsync(async(req,res)=>{
const body = req.body;
const cancelReq = await friendService.removeFriendFromList(body);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    }
  })
})

const acceptRequest = catchAsync(async(req,res)=>{
  const memberId= req.user.id;
  const Id = req.body.id;  //Collection unique Id
  const acceptReq = await friendService.acceptRequest(Id, memberId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    }
  })
})

const friendRequestList = catchAsync(async(req,res)=>{
  const memberId= req.user.id;
  const list = await friendService.friendRequestList(memberId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    list
  })
})

const memberFriendList = catchAsync(async(req,res)=>{
  const Id = req.user.id;  //Collection unique Id
  const list = await friendService.memberFriendList(Id);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    list
  })
})

const viewFriendDetails = catchAsync(async(req,res)=>{
  const friendId = req.body.friendId;
  const friendDetails = await friendService.friendDetails(friendId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    friendDetails
  })
})

const friendProfileDetails = catchAsync(async(req,res)=>{
  const friendId = req.params.friendId;
  const friendDetails = await friendService.friendProfileDetails(friendId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    friendDetails
  })
})


const tagFriendList = catchAsync(async(req,res)=>{
  const memberId= req.user.id;
  const friendList = await friendService.tagFriendList(memberId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    friendList
  })
})

const assignRole = catchAsync(async(req,res)=>{
  const friendId= req.body.id;
  const role= req.body.role;
  const friendList = await friendService.assignRole(friendId, role);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    friendList
  })
})

const memberRequestList = catchAsync(async(req,res)=>{
  const memberId= req.user.id;
  const list = await friendService.memberRequestList(memberId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    list
  })
})

const acceptMemberRequest = catchAsync(async(req,res)=>{
  const friendId= req.body.id;
  const details = await friendService.acceptMemberRequest(friendId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    details
  })
})

const memberList = catchAsync(async(req,res)=>{
  const memberId= req.user.id;
  const list = await friendService.memberList(memberId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    list
  })
})

const searchMembers= catchAsync(async(req,res)=>{
  const chruchId= req.body.chruchId;
  const name= req.body.name;
  const pageNo= req.body.pageNo;
  const list= await friendService.searchMembers(chruchId,name,pageNo);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success
    },
    list
  });
})

const leaderList = catchAsync(async(req,res)=>{
  const memberId= req.user.id;
  const list = await friendService.leaderList(memberId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    list
  })
})

const searchLeaders= catchAsync(async(req,res)=>{
  const chruchId= req.body.chruchId;
  const name= req.body.name;
  const pageNo= req.body.pageNo;
  const list= await friendService.searchLeaders(chruchId,name,pageNo);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success
    },
    list
  });
})

const ministryList = catchAsync(async(req,res)=>{
  const memberId= req.user.id;
  const list = await friendService.ministryList(memberId);
  res.status(httpStatus.OK).send({
    serverResponse:{
      code: httpStatus.OK,
      message: 'Success'
    },
    list
  })
})

const searchMinistry= catchAsync(async(req,res)=>{
  const chruchId= req.body.chruchId;
  const name= req.body.name;
  const pageNo= req.body.pageNo;
  const list= await friendService.searchMinistry(chruchId,name,pageNo);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: messageDir.message.success
    },
    list
  });
})

module.exports={
  suggestionFriendsList,
    sendFriendReq,
    cancelRequest,
    removeFriendFromList,
    acceptRequest,
    memberFriendList,
    viewFriendDetails,
    friendRequestList,
    searchFriends,
    friendProfileDetails,
    tagFriendList,
    assignRole,
    memberRequestList,
    acceptMemberRequest,
    memberList,
    searchMembers,
    leaderList,
    searchLeaders,
    ministryList,
    searchMinistry
}