const httpStatus = require('http-status');
const aws = require('aws-sdk');
const path = require('path');

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
});
const checkImage = async(req, res, next, body, folderPath) => {
        for (let key of Object.keys(body)) {
            if (body[key] instanceof Array) {
                await Promise.all(body[key].map(async(element, index) => {
                    await checkImage(req, res, next, element, folderPath);
                }));
            } else {
                if (key == folderPath && typeof body[key] == 'object') {
                    const url = await fileUploadSingle(req, res, body[key], folderPath);

                    body[key] = url;
                }
            }
        }
    }
    // FILE UPLOAD //
const fileUploadSingle = async(req, res, body, folderPath) => {
    const folderName = folderPath.split('_')[0];
    const base64Data = new Buffer.from(body.file.replace(/^data:.+;base64,/, ''), 'base64');
    const fileExt = body.file.split(';')[0].split('/')[1];
    if (fileExt == undefined || fileExt == '') {
        fileExt = file.mimetype.split('/')[1];
    }
    const filename = `${path.parse(body.filename).name}-${new Date().toISOString()}.${fileExt || 'png'}`;
    const params = {
        Bucket: `${process.env.S3_BUCKET_PATH}/${folderName}`,
        Key: filename,
        ACL: 'public-read',
        Body: base64Data,
    };
    try {
        const stored = await s3.upload(params).promise();
        if (body.old_url) {
            await deleteUploadFile(body.old_url, folderName);
        }
        return stored.Location;
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
const deleteUploadFile = async(old_url, folderPath) => {
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


const uploadFile = (folderPath) => async(req, res, next) => {
    await checkImage(req, res, next, req.body, folderPath);
    next();
};

module.exports = uploadFile;
