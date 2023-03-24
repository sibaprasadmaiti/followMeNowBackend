const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const validator = require('validator');

//Post files schema related with posts
const post_comment_file = mongoose.Schema({
    url: {
      type: String,
    },
    is_deleted: {
      type: String,
    }
  });
  //Post Comment_like schema related with posts
  const post_comment_like = mongoose.Schema({
    like_by_member: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    emoji_type: {
      type: String,
    }
  });
//Main post Comment schema starts
const post_commentSchema = mongoose.Schema(
  {
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Post',
      required: true,
  },
    member: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    parentId:{
      type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    caption: {
      type: String,
      default: null,
    },
    is_reported: {
        type: Boolean,
        default: false,
      },
    status : {
      type:Boolean,
      default: true
    },
    // post_comment_file:[post_comment_file],
    post_comment_like:[post_comment_like],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
post_commentSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Post_comment = mongoose.model('Post_comment', post_commentSchema);

module.exports = Post_comment;
