const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

aws.config.update({
	secretAccessKey: process.env.AWS_SECRET_KEY,
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	region: "ap-south-1",
});
const S3 = new aws.S3();

const upload = multer({
	storage: multerS3({
		s3: S3,
		bucket: "upload-images-nodejs-1",
		acl: "public-read",
		metadata: function (req, file, cb) {
			cb(null, {
				fieldName:
					Date.now() +
					file.fieldname +
					path.extname(file.originalname),
			});
		},
		key: function (req, file, cb) {
			cb(null, Date.now().toString());
		},
	}),
});

module.exports = upload;
