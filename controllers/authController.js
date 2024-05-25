const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const Profile = require('../models/Profile');
const cloudinary = require('cloudinary').v2;

exports.register = async (req, res) => {
    try {
        const { username, email, password, bio, phone, isPublic } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        let profile = await Profile.findOne({ user: user._id });
        if (!profile) {
            profile = new Profile({ user: user._id });
        }

        if (req.body.photo) {
            if (req.body.photo.startsWith('http://') || req.body.photo.startsWith('https://')) {
                profile.photo = req.body.photo;
            } else {
                return res.status(400).json({ message: 'Invalid photo URL' });
            }
        } else if (req.file) {
            const result = await cloudinary.uploader.upload(req?.file?.path, {
                folder: "avatars",
                width: 300,
                crop: "scale"
            });
            profile.photo = result.secure_url;
        }

        profile.bio = bio;
        profile.phone = phone;
        profile.isPublic = isPublic === 'true';
        await profile.save();

        res.status(201).json({ message: 'User registered successfully', profile });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { userId: user._id, role: user.role };
        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });

        user.accessToken = token;
        await user.save();
        res.status(200).json({ token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.accessToken = null;
        await user.save();

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};
