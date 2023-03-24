const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    parent_id: {
      type: String,
      default: '',
    },
    admin_id: {
      type: String,
      default: '',
    },
    agegroup_id: {
      type: String,
      default: '',
    },
    membership_type: {
      type: String,
      required: true,
      enum: ['RM', 'CM', 'CC'],
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    last_name: {
      type: String,
      trim: true,
      default: '',
    },
    full_name: {
      type: String,
      trim: true,
      default: '',
    },
    slug: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    user_type: {
      type: Number,
      default: 0,
    },
    trustee_board: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHERS'],
    },
    marital_status: {
      type: String,
      enum: ['Single', 'Married', 'Widowed','Divorced','Separated'],
    },
    dob: {
      type: String,
      default: '',
    },
    contact_person: {
      type: String,
      default: '',
    },
    contact_mobile: {
      type: String,
      trim: true,
    },
    contact_alt_mobile: {
      type: String,
      required: false,
      trim: true,
    },
    alt_email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    reset_password: {
      type: String,
      trim: true,
      default: '',
    },
    user_address: {
      type: String,
      trim: true,
      default: '',
    },
    user_country: {
      type: String,
      trim: true,
      default: '',
    },
    user_state: {
      type: String,
      trim: true,
      default: '',
    },
    user_city: {
      type: String,
      trim: true,
      default: '',
    },
    postal_code: {
      type: String,
      trim: true,
      default: '',
    },
    profile_image_url: {
      type: String,
      default: '',
    },
    resize_profile_image: {
      type: String,
      default: '',
    },
    resize_cover_image: {
      type: String,
      default: '',
    },
    cover_image: {
      type: String,
      default: '',
    },
    about_you: {
      type: String,
      trim: true,
      default: '',
    },
    other_name: {
      type: String,
      trim: true,
      default: '',
    },
    hobbies: {
      type: String,
      trim: true,
      default: '',
    },
    work_information: {
      type: String,
      trim: true,
      default: '',
    },
    education: {
      type: String,
      trim: true,
      default: '',
    },
    interested_in: {
      type: String,
      trim: true,
      default: '',
    },
    user_language: {
      type: String,
      trim: true,
      default: '',
    },
    favorite_quote: {
      type: String,
      trim: true,
      default: '',
    },
    notification_data: {
      type: String,
      trim: true,
      default: '',
    },
    place_live_data: {
      type: String,
      trim: true,
      default: '',
    },
    our_mission: {
      type: Object,
      default: {
        description:'',
        image_url:''
      }
    },
    our_vission:{
      type: Object,
      default: {
        description:'',
        image_url:''
      }
    },
    todays_thought:{
      type:Object,
      default: {
        title:'',
        description:'',
        image_url:''
      }
    },
    denomination: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Denomination"
    },
    facebook:{
      type:String,
      default:''
    },
    twitter:{
      type:String,
      default:''
    },
    linkedin:{
      type:String,
      default:''
    },
    is_admin: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    admin_create_date: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    is_approved: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    status: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    is_deleted: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    social_id: {
      type: String,
      default: '',
    },
    user_login_type: {
      type: String,
      default: '',
    },
    is_verified: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    postId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Post',
      required: false,
  },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if(user.isModified("first_name") || user.isModified("last_name")){
    user.full_name = `${user.first_name} ${user.last_name}`
  }
  next();
});



/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
