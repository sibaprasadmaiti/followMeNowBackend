'use strict';
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const newsFeedService = require('../../services/newsFeed.service');

const newsFeed = catchAsync(async(req,res)=>{
    const memberId = req.user._id;
    const pageNo = req?.query?.pageNo || 1;
    const list = await newsFeedService.newsFeed(memberId, pageNo);
    res.status(httpStatus.OK).send({
        serverResponse: {
          code: httpStatus.OK,
        },
        list
      });
})

const timeLineSearch = catchAsync(async(req,res)=>{
  const memberId = req.user._id;
  const list = await newsFeedService.timeLineSearch(req.body);
  res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
      },
      list
    });
})
module.exports ={
    newsFeed,
    timeLineSearch
}