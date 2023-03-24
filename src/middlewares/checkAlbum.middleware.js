const AlbumModel = require('../models/album.model');
const ApiError = require('../utils/ApiError');

const checkAlbum = () => async (req, res, next) => {
  const albumName = req?.body?.albumName || '';
  const member = req?.body?.member || '';
  const description = req?.body?.description || '';

  if (!albumName) throw new ApiError(httpStatus.NOT_FOUND, 'Album name is required');

  const ifExist = await AlbumModel.findOne({ albumName: albumName, member: member }).select('_id');
  if (ifExist && (ifExist.id || ifExist._id)) {
    req.body.albumId = ifExist.id ? ifExist.id : ifExist._id;
  } else {
    const createAlbum = await AlbumModel.create({ albumName: albumName, member: member, description: description });
    req.body.albumId = createAlbum._id ? createAlbum._id : createAlbum.id;
  }
  req.body.type = 'album';
  delete req?.body?.albumName;
  delete req?.body?.description;
  next();
};

module.exports = checkAlbum;
