const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const postModel = require('../models/posts.model');
const postCommentModel = require('../models/postComments.model');
const userModel = require('../models/user.model');
const albumModel = require('../models/album.model');

const albumCreate = async (body) => {
  try {
    return postModel.create(body);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

const createAlbums = async (memberId) => {
  try {
    albumModel
      .insertMany([
        { albumName: 'profile-images', member: memberId },
        { albumName: 'cover-images', member: memberId },
        { albumName: 'timeline', member: memberId },
      ])
      .then(function () {
        // console.log("Data inserted")  // Success
        return true;
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

const initialAlbumList = async (memberId) => {
  try {
    return await albumModel.find({ member: memberId });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong');
  }
};

const albumExists = async (albumName, memberId) => {
  try {
    return await albumModel.findOne({ albumName: albumName, member: memberId });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong');
  }
};

const albumUpdate = async (body) => {
  try {
    const albumExists = await albumExists(body.albumName, body.memberId);
    if (albumExists.albumName == body.albumName) {
      throw new ApiError(httpStatus.CONFLICT, 'Album already exists with this name,please try another name!');
    }
    return albumModel.findOneAndUpdate({ _id: albumId }, body);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

const albumList = async (member) => {
  try {
    const albums = await albumModel.find({ member: member });

    const dataSet = await Promise.all(
      albums.map(async (album) => {
        const posts = await postModel.find({ albumId: album._id, type: 'album' }).sort({ createdAt: -1 });
        const totalFiles = await posts.reduce((accumulator, currentObj) => {
          return accumulator + currentObj.post_file.length;
        }, 0);

        return (details = {
          albumId: album._id,
          albumName: album?.albumName,
          totalFiles: totalFiles,
          post_url: posts[0].post_file[posts[0].post_file.length - 1].post_url,
        });
      })
    );
    return dataSet;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

const albumDetials = async (albumId, memberId) => {
  try {
    return await albumModel.findOne({ _id: albumId, member: memberId });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong');
  }
};

const oneAlbumView = async (member, albumId) => {
  try {
    const [posts, userDetails] = await Promise.all([
      postModel.find({ albumId: albumId, member: member, type: 'album' }).sort({ createdAt: -1 }).populate({
        path: 'post_like.like_by_member',
        select: 'full_name resize_profile_image slug _id',
      }),
      userModel.findOne({ _id: member }).select('full_name slug resize_profile_image'),
    ]);

    let dataSet = await posts.reduce(async (post, item) => {
      const likesCount = item.post_like.length;

      const [totalCommentCount, likeFriendsArray] = await Promise.all([
        postCommentModel.find({ postId: item._id }).countDocuments(),
        item.post_like.map((like) => {
          const likeFrndObj = {
            id: like?._id,
            friendId: like?.like_by_member?._id,
            friendName: like?.like_by_member?.full_name,
            emoji_type: like?.emoji_type,
            friend_profile_image: like?.like_by_member?.resize_profile_image,
            slug: like?.like_by_member?.slug,
          };
          return likeFrndObj;
        }),
      ]);

      const allFiles = await post;
      await item.post_file.map(async (file) => {
        let details = {
          postId: item?._id,
          createdAt: item?.createdAt,
          post_file: file?.post_url,
          likeFriendsArray,
          likesCount: likesCount,
          totalCommentCount: totalCommentCount,
        };
        await allFiles.push(details);
      });

      return allFiles;
    }, []);

    const details = {
      authorName: userDetails?.full_name,
      authorSlug: userDetails?.slug,
      authorProfileImage: userDetails?.resize_profile_image,
      files: dataSet,
    };

    return details;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

module.exports = {
  albumCreate,
  albumExists,
  albumUpdate,
  albumList,
  createAlbums,
  initialAlbumList,
  albumDetials,
  oneAlbumView,
};
