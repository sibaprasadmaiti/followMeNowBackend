const aws = require('aws-sdk');
const path = require('path');

const s3 = new aws.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_BUCKET_REGION,
});

const fileUploadSingle = async(body, folderName) => {
  if(body.file && body.filename && folderName){
    const base64Data = new Buffer.from(body.file.replace(/^data:.+;base64,/, ''), 'base64');
    const fileExt = body.file.split(';')[0].split('/')[1];
    if (fileExt == undefined || fileExt == '') {
        fileExt = file.mimetype.split('/')[1];
    }
    const filename = `${path.parse(body.filename).name}-${Date.now()}.${fileExt || 'png'}`;
    const params = {
        Bucket: `${process.env.S3_BUCKET_PATH}/${folderName}`,
        Key: filename,
        ACL: 'public-read',
        Body: base64Data,
    };
    try {
        const stored = await s3.upload(params).promise();
        return stored.Location;
    } catch (err) {
        return null;
    }
  }else if(body.file && !body.filename){
    return body.file
  }else{
    return ""
  }
};

module.exports = fileUploadSingle