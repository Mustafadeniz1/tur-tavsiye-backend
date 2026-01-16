//userController.js backend 
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 🔹 PROFİL GETİR
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 PROFİL GÜNCELLE
const updateProfile = async (req, res) => {
  try {
    const { name, city, district, ageRange, transportPreference } = req.body;

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

    user.name = name;
    user.city = city;
    user.district = district;
    user.ageRange = ageRange;
    user.transportPreference = transportPreference;

    await user.save();
    res.json({ message: 'Profil güncellendi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 ŞİFRE DEĞİŞTİR
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch)
      return res.status(400).json({ message: 'Mevcut şifre yanlış' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Şifre güncellendi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {getProfile,updateProfile,changePassword};