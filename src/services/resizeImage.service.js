const sharp = require('sharp');
const multer = require('multer');
const multerS3 = require("multer-s3");
const fs=require('fs')
const AWS = require('aws-sdk');
const userModel = require('../models/user.model');

// const uploadResizeFile = multer({
//     limits: {
//       fileSize: 10000000 // 1000000 Bytes = 1 MB
//     },
//     fileFilter(req, file, cb) {
//         console.log("file.originalname",file.originalname);
//         if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
//             // upload only png and jpg format
//             return cb(new Error('Please upload a Image'));
//           }
          
//         const resize = resizeImage(file)
          
//     }})

 const resizeImage = async(user,type,fileKey,folderPath)=>{
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey:process.env.S3_SECRET_KEY
      });
      
      const bucketName = process.env.S3_BUCKET_PATH;      
      const bufferData = s3.getObject({ Bucket: bucketName, Key: fileKey }, (err, data) => {
        //*** s3.getObject retrive file from bucket using file key
        if (err) {
          console.error(err);
          return;
        }
        const buffer = Buffer.from(data.Body);
        //*** Converting image to buffer image
        if(buffer){
          const fileNameFrResize = `${Date.now()}`+'outputImage.png';
            sharp(buffer)
            .resize(200, 200)
            .toFile(fileNameFrResize, (err, info) => { 
                if(err){
                    console.log("err from sharp",err);
                }
                if(info){
                    console.log("resize succesfully");

                    const fsResizeData = fs.readFileSync(fileNameFrResize)
                    //S3 Bucket
                    const params = {
                      Bucket: 'followmenow-dev', // pass your bucket name
                      Key: `${folderPath}`, // file will be saved as testBucket/contacts.csv
                      Body: fsResizeData
                      // JSON.stringify(data, null, 2)
                  };
                  s3.upload(params, function(s3Err, data) {
                    if (s3Err) throw s3Err
                    if(data){
                      if(type == 'cover-image'){
                        user.resize_cover_image = data.Location
                        userModel.updateOne({_id:user.id},user, function (err, docs) {
                          if (err){
                              console.log(err)
                          }
                          if(docs){
                            console.log(`Resize file uploaded successfully`);
                            fs.unlinkSync(fileNameFrResize);
                          }
                      });
                      }else{
                        user.resize_profile_image = data.Location;
                        userModel.updateOne({_id:user.id},user, function (err, docs) {
                          if (err){
                              console.log(err)
                          }
                          else{
                            console.log(`Resize file uploaded successfully`);
                            fs.unlinkSync(fileNameFrResize);
                          }
                      });
                      }
                    }
                });
                  //   fs.readFileSync(fileNameFrResize, (err, datas) => {
                  //     if (err) throw err;
                  //     if(datas){
                  //       console.log("data",datas);
                  //       const params = {
                  //           Bucket: 'followmenow-dev', // pass your bucket name
                  //           Key: `${folderPath}`, // file will be saved as testBucket/contacts.csv
                  //           Body: datas
                  //           // JSON.stringify(data, null, 2)
                  //       };
                       

                  //     }
                     
                  // });
                  //S3 Buckeet End
                }
             });
          }
      });

 }
 
 
 
 module.exports={
    resizeImage
 }
 
