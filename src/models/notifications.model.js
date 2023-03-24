const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    markAsRead: {
        type: Boolean,
        required: true,
        default: false
    },
    message: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: false,
        default: ''
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
