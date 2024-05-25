const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    accessToken: { type: String },
    expiry: { type: Date },
    googleId: { type: String },
    profilePicture: { type: String },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }
});

module.exports = mongoose.model('User', UserSchema);
