import dotenv from 'dotenv';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
dotenv.config();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // accept file
  } else {
    cb(new Error('Only image files are allowed'), false); // reject file
  }
};

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET,
    key: function (req, file, cb) {
      const folder = 'assets/images/banners/';
      const fileName = Date.now().toString() + '-' + file.originalname;
      const fullPath = folder + fileName;
      cb(null, fullPath);
    },
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // Limit file size to 5MB
  }
});

export { upload };
