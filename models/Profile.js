const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    photo: { type: String },
    bio: { type: String },
    phone: { type: String },
    isPublic: { type: Boolean, default: true }
});

module.exports = mongoose.model('Profile', ProfileSchema);
