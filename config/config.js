const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process?.env.PORT || 3000,
    jwtSecret: process?.env?.JWT_SECRET || '967623594111627',
    mongoURI: process?.env?.MONGO_URI || 'mongodb+srv://RohitSahu:RHcAMf4JzpCcEbeh@cluster0.iepjb1n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    cloudinaryConfig: {
        cloudName: process?.env?.CLOUDINARY_CLOUD_NAME || 'dg5dkcpkn',
        apiKey: process?.env?.CLOUDINARY_API_KEY || '967623594111627',
        apiSecret: process?.env?.CLOUDINARY_API_SECRET || 'tdB_P9fiYEr9Q56F3p8iU7_DnGM'
    }
};