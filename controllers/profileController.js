const Profile = require('../models/Profile');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.userId });

        res.status(200).json(profile);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.updateProfile = async (req, res) => {
    try {
        console.log('Updating profile', req.file);
        const { bio, phone, isPublic } = req.body;

        if (!bio || !phone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let profile = await Profile.findOne({ user: req.userId });
        if (!profile) {
            profile = new Profile({ user: req.userId });
        }

        if (req.body.photo) {
            if (req.body.photo.startsWith('http://') || req.body.photo.startsWith('https://')) {
                profile.photo = req.body.photo;
            } else {
                return res.status(400).json({ message: 'Invalid photo URL' });
            }
        } else if (req.file) {
            // Upload file to Cloudinary
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

        // if (req.file) {
        //     fs.unlinkSync(req.file.path);
        // }

        res.status(200).json(profile);
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.listProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find({ isPublic: true });
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find();
        if (req.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
