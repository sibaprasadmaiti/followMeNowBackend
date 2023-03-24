const httpStatus = require('http-status');
const aws = require('aws-sdk');
const path = require('path');
const config = require('../config/config');
const postModel = require('../models/posts.model')
const ApiError = require('../utils/ApiError');
let totalCount = 0;
let post_file = [];

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
});
const checkImage = async (req, res, next, body, folderPath, keyName) => {
    // Checking Editable True Or False
    // if (req.body.postId) {
    //     const postDetails = await postModel.findOne({ _id: req.body.postId });
    //     if (postDetails.member != req.body.member) {
    //         req.body['applicableForEdit'] = false;
    //         throw new ApiError(httpStatus.NOT_FOUND, 'Something went error');
    //     }
    // }
    totalCount = req.body.post_file.length;
    let block = body.hasOwnProperty(keyName) ? body[keyName] : body;
    // let block = body.hasOwnProperty('block') ? body.block : body;
    for (let key of Object.keys(block)) {
        if (block[key] instanceof Array) {

            await Promise.all(block[key].map(async (element, index) => {

                await checkImage(req, res, next, element, folderPath);
            }));
        } else {
            if (typeof block[key] == 'object' && folderPath == 'post_url') {
                // console.log(req.body.post_file.length);
                const url = await fileUploadSingle(req, res, block[key].post_url, folderPath);
                if (body.hasOwnProperty('block')) {
                    body.block[key] = url;
                } else {
                    body[key] = url;
                }
            }
        }
    }
}
// FILE UPLOAD //
const fileUploadSingle = async (req, res, body, folderPath) => {
    const folderName = folderPath.split('_')[0];
    const base64Data = new Buffer.from(body.file.replace(/^data:.+;base64,/, ''), 'base64');
    const fileExt = body.file.split(';')[0].split('/')[1];
    // console.log("fileExt",fileExt);
    if (fileExt == undefined || fileExt == '') {
        fileExt = file.mimetype.split('/')[1];
    }
    const filename = `${path.parse(body.filename).name}-${Date.now()}.${fileExt || 'png' || 'jpg' || 'mp4'}`;
    const params = {
        Bucket: `${process.env.S3_BUCKET_PATH}/${req.user._id}/post`,
        Key: filename,
        ACL: 'public-read',
        Body: base64Data,
    };
    try {
        const stored = await s3.upload(params).promise();
        // console.log("stored",stored);
        if (body.old_url) {
            await deleteUploadFile(body.old_url, folderName);
        }
        await pushUploadFile(stored.Location, req);
        // return stored.Location;
    } catch (err) {
        // console.log(err);
        res.status(httpStatus.BAD_REQUEST).send({
            serverResponse: {
                code: httpStatus.BAD_REQUEST,
                message: 'Error to upload file in Server',
            },
        });
    }
};

const pushUploadFile = async (file, req) => {
    post_file.push({
        post_url: file
    })

    if (totalCount == post_file.length) {
        req.body.post_file = post_file
        return req.body.post_file;
    } else {
        console.log("Next function called");
        // next();
    }
}
const deleteUploadFile = async (old_url, folderPath) => {
    let key = old_url.split(folderPath + '/');
    const params1 = {
        Bucket: process.env.S3_BUCKET_PATH,
        Key: folderPath + '/' + decodeURIComponent(key[1]),
    };
    s3.deleteObject(params1, (error, data) => {
        if (error) {
            console.log(error);
        }
    });
};


const uploadPageFile = (folderPath, keyName = 'block') => async (req, res, next) => {
    // console.log(folderPath,"folderPath");
    await checkImage(req, res, next, req.body, folderPath, keyName);
    post_file=[]
    next();
};

module.exports = uploadPageFile;
