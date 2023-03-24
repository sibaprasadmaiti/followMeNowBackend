/** ===========================
 * Dependencies
 ============================= */
const uploader = require('../utils/singleUploader');

function postUpload(req, res, next) {
    console.log("111111111");
    const upload = uploader(
        'posts',
        ['image/jpeg', 'image/jpg', 'image/png'],
        3000000, // 3 MB
        'Only .jpg, jpeg or .png format allowed!',
    );

    // call the middleware function
    upload.any()(req, res, (err) => {
        console.log("2222222222");
        if (err) {
            res.status(500).json({
                code: 500,
                message: err.message
            });
        } else {
            next();
        }
    });
}

module.exports = postUpload;
