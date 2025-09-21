const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "WonderRooms_DEV", // The folder in your Cloudinary account where files will be stored
    allowedFormats: ["png", "jpeg", "jpg"], // Allowed image formats for upload
  },
});

module.exports = { cloudinary, storage };
