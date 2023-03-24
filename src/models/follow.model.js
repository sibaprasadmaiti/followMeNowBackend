const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const followSchema = mongoose.Schema(
  {
    following: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    follower: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
followSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
