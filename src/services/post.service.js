const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const postModel = require('../models/posts.model');
const userModel = require('../models/user.model');
const postCommentModel = require('../models/postComments.model');
const { securityTextDataset } = require('../docs/textDataSet');

const createPost = async (body) => {
  try {
    // let checkCaption=await checkWordsSecurity(body.caption);
    // if(checkCaption){
    return await postModel.create(body);
    // }else{
    //     throw new ApiError(httpStatus.NOT_FOUND, 'Your caption includes NSFW words please check before submiting');
    // }
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const postList = async (userId, slug, pageNo) => {
  const limit = 5;
  let skip = 0;
  if (pageNo > 1) skip = (parseInt(pageNo) - 1) * limit;
  let memberId = userId;
  const userDetails = await userModel.findOne({ slug: slug }).select('_id');
  if (userDetails?.id != userId) {
    memberId = userDetails.id;
  }

  const data = await postModel
    .find({ member: memberId, type: {$ne: "album"}})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate({
      path: 'member',
      select: 'full_name slug resize_profile_image gender',
    })
    .populate({
      path: 'post_tag_friends.tagged_member_id',
      select: 'full_name resize_profile_image slug  _id',
    })
    .populate({
      path: 'post_like.like_by_member',
      select: 'full_name resize_profile_image slug _id',
    });

  const dataSet = await Promise.all(
    data.map(async (post) => {
      const likesCount = post.post_like.length;
      const tagFriendsCount = post.post_tag_friends.length;

      const [totalCommentCount, tagFriendArray, likeFriendsArray] = await Promise.all([
        postCommentModel.find({ postId: post._id }).countDocuments(),
        post?.post_tag_friends.map((item) => {
          const tagFrndObj = {
            id: item?.id,
            friendId: item?.tagged_member_id?._id,
            friendName: item?.tagged_member_id?.full_name,
            friend_profile_image: item?.tagged_member_id?.resize_profile_image,
            slug: item?.tagged_member_id?.slug,
          };
          return tagFrndObj;
        }),
        post.post_like.map((item) => {
          const likeFrndObj = {
            id: item?._id,
            friendId: item?.like_by_member?._id,
            friendName: item?.like_by_member?.full_name,
            emoji_type: item?.emoji_type,
            friend_profile_image: item?.like_by_member?.resize_profile_image,
            slug: item?.like_by_member?.slug,
          };
          return likeFrndObj;
        }),
      ]);

      let title = ""
      
      if(post?.type && (post?.type == 'cover' || post?.type == 'profile')){
          title = `update ${post?.member?.gender == 'MALE' ? 'his' : 'her'} ${post?.type} picture`
      }

      let details = {
        postId: post?._id,
        title: title,
        authorName: post?.member?.full_name,
        authorSlug: post?.member?.slug,
        authorProfileImage: post?.member?.resize_profile_image,
        caption: post?.caption,
        location: post?.location,
        createdAt: post?.createdAt,
        post_file: post?.post_file,
        tagFriendArray,
        likeFriendsArray,
        likesCount: likesCount,
        tagFriendsCount: tagFriendsCount,
        totalCommentCount: totalCommentCount,
      };

      return details;
    })
  );
  return dataSet;
};

const postDetails = async (body) => {
  let tagFriendArray = [];
  let likeFriendsArray = [];
  let totalLikeCount = 0;
  let totalTagFriends = 0;

  const postDetails = await postModel
    .findOne({ _id: body.postId })
    .populate({
      path: 'member',
      select: 'full_name slug resize_profile_image',
    })
    .populate({
      path: 'post_tag_friends.tagged_member_id',
      select: 'full_name resize_profile_image slug  _id',
    })
    .populate({
      path: 'post_like.like_by_member',
      select: 'full_name resize_profile_image slug  _id',
    });
  const totalCommentCount = await postCommentModel.find({ postId: body.postId }).countDocuments();

  //Need to check
  let commentData = [];
  commentData = await commentList(body);
  totalLikeCount = postDetails.post_like.length;
  totalTagFriends = postDetails.post_tag_friends.length;

  //For Post tag friend array ready
  if (postDetails.post_tag_friends.length > 0) {
    postDetails.post_tag_friends.map((item) => {
      tagFriendArray.push({
        id: item.id,
        friendId: item.tagged_member_id._id,
        friendName: item.tagged_member_id.full_name,
        friend_profile_image: item.tagged_member_id.resize_profile_image,
        slug: item.tagged_member_id.slug,
      });
      // return data;
    });
  }
  //For Post like array ready
  if (postDetails.post_like.length > 0) {
    postDetails.post_like.map((item) => {
      likeFriendsArray.push({
        id: item._id,
        friendId: item.like_by_member._id,
        friendName: item.like_by_member.full_name,
        emoji_type: item.emoji_type,
        friend_profile_image: item.like_by_member.resize_profile_image,
        slug: item.like_by_member.slug,
      });
      // return data;
    });
  }
  const details = {
    caption: postDetails.caption,
    createdAt: postDetails.createdAt,
    location: postDetails.location,
    is_reported: postDetails.is_reported,
    status: postDetails.status,
    authorName: postDetails.member.full_name,
    authorSlug: postDetails.member.slug,
    authorProfileImage: postDetails.member.resize_profile_image,
    totalLikeCount: totalLikeCount,
    totalTagFriends: totalTagFriends,
    post_file: postDetails.post_file,
    likeFriendsArray: likeFriendsArray,
    tagFriendArray: tagFriendArray,
    totalCommentCount: totalCommentCount,
    commentData: commentData,
  };

  return details;
};

const postLikeDetails = async (body) => {
  let likeFriendsArray = [];
  let likesCount = 0;

  const postDetails = await postModel.findOne({ _id: body.postId }).populate({
    path: 'post_like.like_by_member',
    select: 'full_name resize_profile_image slug  _id',
  });

  likesCount = postDetails.post_like.length;

  //For Post like array ready
  if (postDetails.post_like.length > 0) {
    postDetails.post_like.map((item) => {
      likeFriendsArray.push({
        id: item._id,
        friendId: item.like_by_member._id,
        friendName: item.like_by_member.full_name,
        emoji_type: item.emoji_type,
        friend_profile_image: item.like_by_member.resize_profile_image,
        slug: item.like_by_member.slug,
      });
      // return data;
    });
  }

  const details = {
    likesCount: likesCount,
    likeFriendsArray: likeFriendsArray,
  };

  return details;
};

const postLikeGenerate = async (body) => {
  try {
    const post = await getPostById(body.postId);
    if (!post) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Post not found');
    }
    const likeAlready_exists = await likeAlreadyExists(body.postId, body.friendId);
    // console.log("likeAlready_exists ====",likeAlready_exists);
    if (!likeAlready_exists) {
      // console.log("1111111111");
      const like = await postModel.findOneAndUpdate(
        { _id: body.postId },
        {
          $push: {
            post_like: {
              like_by_member: body.friendId,
              emoji_type: body.emoji_type,
            },
          },
        }
      );
      return postLikeDetails(body);
    } else {
      const like = await postModel.findOneAndUpdate(
        { _id: body.postId, 'post_like.like_by_member': { $in: body.friendId } },
        { $pull: { post_like: { like_by_member: body.friendId } } }
      );
      return postLikeDetails(body);
    }
  } catch (error) {
    console.log('error', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went error');
  }
};

const likeAlreadyExists = async (postId, friendId) => {
  try {
    const data = await postModel.findOne({ _id: postId });

    let Check = await data.post_like.find((item) => {
      // console.log(item.like_by_member == friendId);
      return item.like_by_member == friendId;
      // return item
    });

    return Check;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went error');
  }
};

const updatePost = async (body) => {
  try {
    // if(body.applicableForEdit==false){
    //     throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
    // }
    const [updatePushFile, updatePullFile] = await Promise.all([
      postModel.findByIdAndUpdate(body.postId, {
        caption: body.caption,
        location: body.location,
        post_tag_friends: body.post_tag_friends,
        $push: {
          post_file: body.post_file,
        },
      }),
      postModel.findByIdAndUpdate(body.postId, {
        $pull: {
          post_file: { _id: { $in: body.delete_file_ids } },
        },
      }),
    ]);
    return updatePushFile;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const postDelete = async (body) => {
  const postExistsForMember = await postAuthorizedMember(body.postId, body.memberId);
  if (!postExistsForMember) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to delete this post');
  }
  const deletePost = await postModel.deleteOne({ _id: body.postId });
  return deletePost;
};

const postAuthorizedMember = async (postId, memberId) => {
  try {
    return await postModel.findOne({ _id: postId, member: memberId });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
  }
};
const generateComment = async (body) => {
  try {
    if (body.parentId != '') {
      await postCommentModel.create(body);
      const [totalCommentCount, comments] = await Promise.all([
        postCommentModel.find({ postId: body.postId }).countDocuments(),
        commentList(body),
      ]);
      return { totalCommentCount: totalCommentCount, commentList: comments };
    } else {
      delete body.parentId;
      await postCommentModel.create(body);
      const [totalCommentCount, comments] = await Promise.all([
        postCommentModel.find({ postId: body.postId }).countDocuments(),
        commentList(body),
      ]);
      return { totalCommentCount: totalCommentCount, commentList: comments };
    }
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went error');
  }
};

const modifyComment = async (body) => {
  if (body.parentId != '') {
    return await postCommentModel.findOneAndUpdate({ _id: body.commentId }, body);
  } else {
    delete body.parentId;
    return await postCommentModel.findOneAndUpdate({ _id: body.commentId }, body);
  }
};

const commentList = async (body) => {
  let totalCommentLike = 0;
  let commentList = [];
  const list = await postCommentModel
    .find({ postId: body.postId })
    .populate({
      path: 'member',
      select: 'full_name resize_profile_image slug  _id',
    })
    .populate({
      path: 'post_comment_like.like_by_member',
      select: 'full_name resize_profile_image slug  _id',
    })
    .sort({ createdAt: -1 });

  if (list.length < 1) {
    return [];
    // throw new ApiError(httpStatus.OK, 'No Data Found');
  }
  for (let comment of list) {
    likeFriendsArray = [];
    totalCommentLike = comment.post_comment_like.length;
    //For Post like array ready
    if (comment.post_comment_like.length > 0) {
      comment.post_comment_like.map((item) => {
        likeFriendsArray.push({
          id: item._id,
          friendId: item.like_by_member._id,
          friendName: item.like_by_member.full_name,
          profile_image_url: item.like_by_member.resize_profile_image,
          slug: item.like_by_member.slug,
          emoji_type: item.emoji_type,
        });
        // return data;
      });
    }

    commentList.push({
      commentId: comment?._id,
      caption: comment?.caption,
      is_reported: comment?.is_reported,
      status: comment?.status,
      postId: comment?.postId,
      parentId: comment?.parentId,
      member: comment?.member?._id,
      authorName: comment?.member?.full_name,
      authorSlug: comment?.member?.slug,
      authorProfileImage: comment?.member?.resize_profile_image,
      likeFriendsArray: likeFriendsArray,
      totalCommentLike: totalCommentLike,
      createdAt: comment?.createdAt,
    });
  }

  return commentList;
};
const getPostById = async (postId) => {
  try {
    return await postModel.findOne({ _id: postId });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went error');
  }
};

const commentDelete = async (body) => {
  const commentId = body.commentId;
  const postId = body.postId;
  const memberId = body.memberId;
  const commentAuthorizedPostAuthor = await postModel.findOne({ _id: postId, member: memberId });

  if (!commentAuthorizedPostAuthor) {
    const commentAuthorizedCommentAuthor = await postCommentModel.findOne({ _id: commentId, member: memberId });
    if (!commentAuthorizedCommentAuthor) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to delete this comment');
    }
    return await postCommentModel.deleteOne({ _id: commentId });
  }
  return await postCommentModel.deleteOne({ _id: commentId });
};

const commentLikeGenerate = async (body) => {
  try {
    const commentFind = await postCommentModel.findOne({ _id: body.commentId });
    if (!commentFind) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Comment not found');
    }
    const commentLike_exists = await commentLikeAlready_exists(body.commentId, body.friendId);
    // console.log("likeAlready_exists ====",likeAlready_exists);
    if (!commentLike_exists) {
      // console.log("1111111111");
      const like = await postCommentModel.findOneAndUpdate(
        { _id: body.commentId },
        {
          $push: {
            post_like: {
              like_by_member: body.friendId,
              emoji_type: body.emoji_type,
            },
          },
        }
      );
      return like;
    } else {
      // console.log("222222222222222");
      const like = await postCommentModel.findOneAndUpdate(
        { _id: body.postId, 'post_comment_like.like_by_member': { $in: body.friendId } },
        {
          'post_comment_like.$.like_by_member': body.friendId,
          'post_comment_like.$.emoji_type': body.emoji_type,
        }
      );
      return like;
    }
  } catch (error) {
    console.log('error', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went error');
  }
};

const commentLikeAlready_exists = async (commentId, friendId) => {
  try {
    const data = await postCommentModel.findOne({ _id: commentId });

    let Check = await data.post_comment_like.find((item) => {
      // console.log(item.like_by_member == friendId);
      return item.like_by_member == friendId;
      // return item
    });
    //   console.log("checking",Check);
    return Check;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went error');
  }
};
const checkWordsSecurity = async (caption) => {
  try {
    let found = securityTextDataset.every((item) => caption.includes(item));
    return found;
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

module.exports = {
  createPost,
  checkWordsSecurity,
  postList,
  postLikeGenerate,
  getPostById,
  likeAlreadyExists,
  postDetails,
  postDelete,
  postAuthorizedMember,
  updatePost,
  generateComment,
  modifyComment,
  commentList,
  commentLikeGenerate,
  commentLikeAlready_exists,
  commentDelete,
};
