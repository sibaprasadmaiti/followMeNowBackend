'use strict';
const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const albumService = require('../../services/album.service');

const albumCreate = async(req,res)=>{
    const albumCreate = await albumService.albumCreate(req.body);
    res.status(httpStatus.OK).send({
        serverResponse: {
          code: httpStatus.OK,
          message: 'Album successfully created',
        }
      });
}

const albumUpdate = async(req,res)=>{
    const albumUpdate = await albumService.albumUpdate(req.body);
    res.status(httpStatus.OK).send({
        serverResponse: {
          code: httpStatus.OK,
          message: 'Album update successfully',
        }
      });
}

const albumList = async(req,res)=>{
  const memberId = req.user._id;
    const list = await albumService.albumList(memberId);
    res.status(httpStatus.OK).send({
        serverResponse: {
          code: httpStatus.OK,
          message: 'Album successfully created',
        },
        list
      });
}

const initialAlbumList = async(req,res)=>{
  const memberId = req.user._id;
  const list = await albumService.initialAlbumList(memberId);
  res.status(httpStatus.OK).send({
      serverResponse: {
        code: httpStatus.OK,
      },
      list
    });
}
const albumDetials= async(req,res)=>{
  const albumId= req.params.albumId;
  const memberId = req.user._id;

    const details = await albumService.albumDetials(albumId,memberId);
    res.status(httpStatus.OK).send({
        serverResponse: {
          code: httpStatus.OK,
        },
        details
      });
}

const oneAlbumView = async(req,res)=>{
  const memberId = req.user._id;

    const list = await albumService.oneAlbumView(memberId);
    res.status(httpStatus.OK).send({
        serverResponse: {
          code: httpStatus.OK,
        },
        list
      });
}

module.exports ={
    albumCreate,
    albumList,
    albumDetials,
    albumUpdate,
    initialAlbumList,
    oneAlbumView
}