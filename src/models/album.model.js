const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const validator = require('validator');

const albumSchema = mongoose.Schema(
  {
    albumName: {
      type: String,
      required: true,
    },
    member: {
        type: mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required: true
    },
    description: {
        type: String,
        required: false,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
albumSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
