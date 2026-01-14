const express = require('express');
const { registerUser, loginUser, getMe, updateProfile, updateProfilePicture, changePassword, deleteAccount, getAllUsers } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', protect, admin, getAllUsers);
router.put('/profile', protect, updateProfile);
router.put('/profile/picture', protect, upload.single('profilePicture'), updateProfilePicture);
router.put('/password', protect, changePassword);
router.delete('/profile', protect, deleteAccount);

module.exports = router;
