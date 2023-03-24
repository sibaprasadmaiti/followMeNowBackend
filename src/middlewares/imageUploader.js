'use strict';
const multer = require('multer');
const fs = require('fs');

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = './src/public/profileImages/' + req.user.id + '/';
    //folder create
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
    //remove exsisting image
    const imageRemovepath = directory + req.user.profile_image_url;
    if (fs.existsSync(imageRemovepath)) {
      fs.unlink(imageRemovepath, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
    cb(null, directory)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'));
    }
    cb(undefined, true);
  },
});

//cover image upload
const pictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      var directory = './src/public/coverImages/' + req.user.id + '/';
      // folder create
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
      //remove exsisting image
      var imageRemovepath = directory + req.user.cover_image;
    if (fs.existsSync(imageRemovepath)) {
      fs.unlink(imageRemovepath, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
    }
    cb(null, directory)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const profileCoverImgUpload = multer({
  storage: pictureStorage,
  limits: {
    fileSize: 1000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'));
    }
    cb(undefined, true);
  },
});

module.exports = {
  upload,
  profileCoverImgUpload,
};


