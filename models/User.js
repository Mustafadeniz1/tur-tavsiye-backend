//user.js kodu 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
   // 🔽 AYARLAR / PROFİL ALANLARI
  city: { type: String, default: "" },
  district: { type: String, default: "" },
  ageRange: { type: String, default: "" }, // "18-25", "26-35"
  transportPreference: {
    type: String,
    enum: ["CAR", "TRANSIT", "WALK", "FLIGHT"],
    default: "CAR"
  },

  // 🔐 GÜVENLİK
  lastLoginAt: { type: Date, default: null }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
