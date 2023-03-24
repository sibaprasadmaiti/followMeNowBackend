const multer = require('multer');
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
  });
    
  const uploadS3ProfileImage = multer({
    storage: multerS3({
      s3: s3,
      acl: "public-read",
      bucket: "followmenow-dev",
      key: function (req, file, cb) {
        cb(null, `${req.user._id}`+"/profile-images/"+`${Date.now()}_${file.originalname}`); //use Date.now() for unique file keys
      },
    }),
  });
  //avijit@followme.com
  //Password@123
  const uploadS3CoverImage = multer({
    storage: multerS3({
      s3: s3,
      bucket: "followmenow-dev",
      acl: "public-read",
      key: function (req, file, cb) {
        cb(null, `${req.user._id}`+"/cover-images/"+`${Date.now()}_${file.originalname}`); //use Date.now() for unique file keys
      },
    }),
  });

  module.exports={
    uploadS3ProfileImage,
    uploadS3CoverImage
  }