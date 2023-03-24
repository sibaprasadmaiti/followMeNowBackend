const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const validator = require('validator');

const settingsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    who_access_ur_profile: {
      type: String,
      enum: ['only_me', 'only_friends', 'all'],
      default: 'all'
    },
    follow_me: {
      type: Boolean,
      default: false
    },
    send_me_notification: {
      type: Boolean,
      default: false
    },
    send_me_notification: {
      type: Boolean,
      default: false
    },
    text_message_to_phone: {
      type: Boolean,
      default: false
    },
    tagging: {
      type: Boolean,
      default: false
    },
    sound_notification: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
settingsSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
