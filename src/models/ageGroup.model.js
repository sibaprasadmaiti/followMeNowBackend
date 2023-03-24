const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const ageGroupSchema = mongoose.Schema(
  {
    age_group_name: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    age_range: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    min_age: {
      type: Number,
      required: true,
      trim: true,
      default: null,
    },
    max_age: {
      type: Number,
      required: true,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
ageGroupSchema.plugin(toJSON);
ageGroupSchema.plugin(paginate);

/**
 * @typedef AgeGroup
 */
const AgeGroup = mongoose.model('AgeGroup', ageGroupSchema);

module.exports = AgeGroup;
