const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const MessageSchema = mongoose.Schema(
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
    conversationId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
MessageSchema.plugin(toJSON);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
