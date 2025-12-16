const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "media_uploads",
    resource_type: "auto", // image, video, audio
  },
});

const upload = multer({ storage });

module.exports = upload;
