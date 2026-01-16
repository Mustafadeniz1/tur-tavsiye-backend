//SavedPlaces.js
const mongoose = require("mongoose");

const savedPlaceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    placeId: { type: String, required: true },
    category: { type: String, default: "saved" },
    savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SavedPlace", savedPlaceSchema);
