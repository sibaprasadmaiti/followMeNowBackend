const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const userModel = require('../models/user.model');
const followModel = require('../models/follow.model');
const denomination = require('../models/denomination.model');
const postModel = require('../models/posts.model');

const churchProfile = async (slug) => {
  try {
    const churchDetails = await userModel
      .findOne({ slug: slug })
      .select(
        '_id full_name contact_mobile user_address user_country user_state user_city postal_code dob email our_mission our_vission todays_thought facebook twitter linkedin about_you resize_profile_image cover_image denomination'
      );

    if (churchDetails.denomination) {
      const denominationDetails = await denomination.findById(churchDetails.denomination).select('denomination');
      churchDetails._doc.denomination = denominationDetails?.denomination;
    } else {
      churchDetails._doc.denomination = '';
    }
    return churchDetails._doc;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong!');
  }
};

const memberAndFollowCount = async (slug) => {
  try {
    const details = await userModel
      .findOne({
        slug: slug,
      })
      .select('_id');

    const [following, followers, members] = await Promise.all([
      followModel.find({ following: details._id }).countDocuments(),
      followModel.find({ follower: details._id }).countDocuments(),
      userModel.find({ parent_id: details._id }).countDocuments(),
    ]);

    return { following: following, followers: followers, members: members };
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const photoAndVideo = async (slug) => {
  try {
    const churchDetails = await userModel.findOne({ slug: slug }).select('_id');
    const images = [];
    const videos = [];
    if (churchDetails) {
      const post = await postModel
        .find({ status: true, member: churchDetails._id })
        .sort({ updatedAt: -1 })
        .limit(10)
        .select('post_file');

      await post.map((data) => {
        const files = data?.post_file.map((item) => {
          return item?.post_url;
        });

        files.forEach((file) => {
          if (file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.jpg')) {
            images.push(file);
          } else if (file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov')) {
            videos.push(file);
          }
        });
      });
    }
    return {
      images: images,
      videos: videos,
    };
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong!');
  }
};

const leadershipAndMinistries = async (slug) => {
  try {
    const churchDetails = await userModel
      .findOne({
        slug: slug,
      })
      .select('_id');

    const [leadership, ministries] = await Promise.all([
      userModel.find({ parent_id: churchDetails?._id, role: 'leadership' }).select('full_name slug resize_profile_image'),
      userModel.find({ parent_id: churchDetails?._id, role: 'ministries' }).select('full_name slug resize_profile_image'),
    ]);

    return {
      leadership,
      ministries,
    };
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

const allPhotos = async (slug) => {
  try {
    const churchDetails = await userModel.findOne({ slug: slug }).select('_id');
    const images = [];
    if (churchDetails) {
      const post = await postModel
        .find({ status: true, member: churchDetails._id })
        .sort({ updatedAt: -1 })
        .select('post_file');

      await post.map((data) => {
        const files = data?.post_file.map((item) => {
          return item?.post_url;
        });

        files.forEach((file) => {
          if (file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.jpg')) {
            images.push(file);
          }
        });
      });
    }
    return images;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong!');
  }
};

const allVideos = async (slug) => {
  try {
    const churchDetails = await userModel.findOne({ slug: slug }).select('_id');
    const videos = [];
    if (churchDetails) {
      const post = await postModel
        .find({ status: true, member: churchDetails._id })
        .sort({ updatedAt: -1 })
        .select('post_file');

      await post.map((data) => {
        const files = data?.post_file.map((item) => {
          return item?.post_url;
        });

        files.forEach((file) => {
          if (file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov')) {
            videos.push(file);
          }
        });
      });
    }
    return videos;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went wrong!');
  }
};

const memberList = async (slug) => {
  try {
    const details = await userModel
      .findOne({
        slug: slug,
      })
      .select('_id');

    const members = await userModel
      .find({ parent_id: details._id })
      .select(
        'resize_profile_image full_name contact_mobile user_address user_country user_state user_city postal_code dob'
      );

    return members;
  } catch (error) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
  }
};

module.exports = {
  churchProfile,
  memberAndFollowCount,
  photoAndVideo,
  leadershipAndMinistries,
  allPhotos,
  allVideos,
  memberList,
};
