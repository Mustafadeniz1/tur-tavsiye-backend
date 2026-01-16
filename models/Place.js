//Place.js
const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    placeId: { type: String, required: true, unique: true },
    name: String,
    address: String,
    rating: Number,
    latitude: Number,
    longitude: Number,
    types: [String],
    photoUrl: String,
    category: String,
    googleData: Object,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Place", placeSchema);
