const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const validator = require('validator');

//Post likes schema related with posts
const post_like = mongoose.Schema({
  like_by_member: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  emoji_type: {
    type: String,
  },
});

//Post files schema related with posts
const post_file = mongoose.Schema({
  post_url:{
    type:String,
  }
});
//Post tag friends schema related with posts
const post_tag_friends = mongoose.Schema({
  tagged_member_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  is_deleted: {
    type: String,
  },
});
//Main post schema starts
const postSchema = mongoose.Schema(
  {
    member: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    caption: {
      type: String,
      default: null,
    },
    is_reported: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ['album', 'post', 'cover' ,'profile'],
      default:'post'
    },
    albumId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Album',
      required: false,
    },
    location: {
      type: Object,
      default: null,
    },
    post_file: [post_file],
    post_like: [post_like],
    post_tag_friends: [post_tag_friends],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
