const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const ConversationSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
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
ConversationSchema.plugin(toJSON);

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;
