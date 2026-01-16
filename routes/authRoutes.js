//authRoutes.js kodu 
const express = require('express');
const { registerUser, loginUser, verifyToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Korunanaklı rota (token gerekli olan yapı)
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Hoş geldin, ${req.user.email}` });
});

module.exports = router;
