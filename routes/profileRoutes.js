const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const profileController = require('../controllers/profileController');
const upload = require('../middlewares/multerMiddleware');



router.get('/me', authMiddleware, profileController.getProfile);
router.put('/me', authMiddleware, upload.single('photo'), profileController.updateProfile);
router.get('/public', profileController.listProfiles);
router.get('/all', authMiddleware, roleMiddleware(['admin']), profileController.getUserProfiles);

module.exports = router;
