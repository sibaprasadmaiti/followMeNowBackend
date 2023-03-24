const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const validator = require('validator');

const otpSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
otpSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
