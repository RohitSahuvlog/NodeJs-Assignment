const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');

router.post('/register', upload.single('photo'), authController.register);
router.post('/login', authController.login);
router.post('/logout', auth, authController.logout);

module.exports = router;
