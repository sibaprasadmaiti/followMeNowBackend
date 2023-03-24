/** ===========================
 * Dependencies
 ============================= */
const multer = require('multer');
const path = require('path');
const createError = require('http-errors');
const { spawn } = require("child_process");
const ApiError = require('./../utils/ApiError');
// const {nsfwChecking} = require('./../utils/imageSecurity');

const uploader = (subfolder_path, allowed_file_types, max_file_size, error_msg) => {
    // File upload folder
    const UPLOADS_FOLDER = `./src/public/${subfolder_path}/`;

    // define the storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_FOLDER);
        },
        filename: (req, file, cb) => {
            if (file != '') {
                // const imageCheck = nsfwChecking(file);

                // const imageCheck = spawn('python', ['imageSecurity.py', file]);
                // imageCheck.stdout.on('data',function (data,err){
                //     // console.log("doneee");
                //     console.log(data.toString());
                //     const msg=data.toString()
                //     if(msg=='success'){
                //     console.log("doneee");
                //     }
                //     if(err){
                //         console.log(err.toString());
                //     }
                // })
                // if (!imageCheck) {
                //     throw new ApiError(httpStatus.NOT_FOUND, 'Image contains sexual contents');
                // }
                const fileExt = path.extname(file.originalname);
                const fileName = `${file.originalname
                    .replace(fileExt, '')
                    .toLowerCase()
                    .split(' ')
                    .join('-')}-${Date.now()}`;

                cb(null, fileName + fileExt);
            }

        },
    });

    // preapre the final multer upload object
    const upload = multer({
        storage,
        limits: {
            fileSize: max_file_size,
        },
        fileFilter: (req, file, cb) => {
            if (allowed_file_types.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(createError(error_msg));
            }
        },
    });

    return upload;
};

module.exports = uploader;
