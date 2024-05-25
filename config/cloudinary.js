const config = require('./config');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: config.cloudinaryConfig.cloudName,
    api_key: config.cloudinaryConfig.apiKey,
    api_secret: config.cloudinaryConfig.apiSecret // fixed api_secret
});

module.exports = cloudinary;