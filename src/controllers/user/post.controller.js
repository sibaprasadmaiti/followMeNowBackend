'use strict';
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const postService = require('../../services/post.service');
const path = require('path');

const createPost = catchAsync(async (req, res) => {
  const body = req.body;
  const post = await postService.createPost(body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Post successfully uploaded',
    }
  });
})

const postList = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const slug = req.body.slug;
  const pageNo = req.body.pageNo || 1;
  const list = await postService.postList(userId, slug, pageNo);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK
    },
    list
  })
})

const postDetails = catchAsync(async (req, res) => {
  const details = await postService.postDetails(req.body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
    },
    details
  })
})

const postLikeGenerate = catchAsync(async (req, res) => {
  const likeGenerate = await postService.postLikeGenerate(req.body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'You liked this post'
    },
    details: likeGenerate
  })
})

const postDelete = catchAsync(async (req, res) => {
  const list = await postService.postDelete(req.body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Post is deleted'
    },
  })
})

const updatePost = catchAsync(async(req,res)=>{
  const body = req.body;
  const post = await postService.updatePost(body);
      res.status(httpStatus.OK).send({
        serverResponse: {
          code: httpStatus.OK,
          message: 'Post successfully uploaded',
        }
      });
})

const commentGenerate = catchAsync(async (req, res) => {
  const commentGenerate = await postService.generateComment(req.body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'You comment on this post'
    },
    details: commentGenerate
  })
})

const commentModify = catchAsync(async (req, res) => {
  const commentModify = await postService.modifyComment(req.body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Your comment is updated successfully on this post'
    },
  })
})

const commentList = catchAsync(async (req, res) => {
  const list = await postService.commentList(req.body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
    },
    list
  })
})

const commentLikeGenerate = catchAsync(async (req, res) => {
  const list = await postService.commentLikeGenerate(req.body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Your like generated successfully'
    },
  })
})
const commentDelete = catchAsync(async (req, res) => {
  const list = await postService.commentDelete(req.body);
  res.status(httpStatus.OK).send({
    serverResponse: {
      code: httpStatus.OK,
      message: 'Comment is deleted'
    },
  })
})

module.exports = {
  createPost,
  postList,
  postLikeGenerate,
  postDetails,
  postDelete,
  updatePost,
  commentGenerate,
  commentModify,
  commentList,
  commentLikeGenerate,
  commentDelete,  
}