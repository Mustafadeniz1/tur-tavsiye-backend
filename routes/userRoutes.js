const express = require('express');
const router = express.Router();

const { verifyToken } = require('../controllers/authController');
const {getProfile,updateProfile,changePassword} = require('../controllers/userController');

// 🔹 Ayarlar
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.post('/change-password', verifyToken, changePassword);

module.exports = router;