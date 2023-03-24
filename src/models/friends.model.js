const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const validator = require('validator');

const friendSchema = mongoose.Schema(
  {
    member: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
    friend: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
    request_date: {
        type: Date,
        default: null,
      },
    confirm_date	: {
        type: Date,
        default: null,
      },
    is_removed	: {
          type: Boolean,
          default: false,
        },
    is_friend : {
        type:Boolean,
        default: false
      }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
friendSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Friends = mongoose.model('Friends', friendSchema);

module.exports = Friends;
