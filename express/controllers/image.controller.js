const dynamo = require('../database/dynamo');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = dynamo.s3;

// Upload profile picture to local folder
const upload = multer({
    storage: multerS3({
        s3,
        bucket: "a1-react-assets-uploads",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "TESTING_METADATA" });
        },
        key: function (req, file, cb) {
            const filename = Date.now() + "-" + file.originalname;
            const path = 'profpic/' + filename;
            cb(null, path);
        },
    }),
});
const singleUpload = upload.single("file");
exports.profpic = async (req, res) => {
    singleUpload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.json({
                success: false,
                errors: {
                    title: "Image Upload Error",
                    detail: err.message,
                    error: err,
                },
            });
        }

        let update = { image: req.file.location, message: "success" };
        console.log(update);
        return res.json(update);
    });
}

// Delete image in S3 Bucket
exports.delete = async (req, res) => {
    try {
        s3.deleteObject({
            Bucket: 'a1-react-assets-uploads',
            Key: req.body.filename
        }, function (err, data) {
            if(err) {
                console.log(err);
            }else {
                res.send({
                    status: true,
                    message: "File deleted!"
                });
            }
        });
    }catch (err) {
        console.log(err);
    }
}

// Upload post image to S3 bucket
const postUpload = multer({
    storage: multerS3({
        s3,
        bucket: "a1-react-assets-uploads",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "TESTING_METADATA" });
        },
        key: function (req, file, cb) {
            const filename = Date.now() + "-" + file.originalname;
            const path = 'post_images/' + filename;
            cb(null, path);
        },
    }),
});
const singlePostUpload = postUpload.single("file");
exports.uploadimg = async (req, res) => {
    singlePostUpload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.json({
                success: false,
                errors: {
                    title: "Image Upload Error",
                    detail: err.message,
                    error: err,
                },
            });
        }

        let update = { image: req.file.location, message: "success" };
        console.log(update);
        return res.json(update);
    });
}