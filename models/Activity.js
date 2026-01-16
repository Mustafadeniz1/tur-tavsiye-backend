//Activity.js (Tavsiye sistemi için)
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
     // ✅ Google Places placeId string geliyor -> String olmalı
    placeId: { type: String, default: null },

    // ✅ Frontend'in gönderdiği action'larla birebir aynı olmalı
    action: {
      type: String,
      enum: ["CATEGORY_OPEN", "PLACE_VIEW", "PLACE_SAVE", "ROUTE_SAVE"],
      required: true
    },

    category: { type: String, default: null },

    //  eski yapı ile uyum için kalsın
    timestamp: { type: Date, default: Date.now }
  },
  {
    // ✅ recommendationController createdAt ile sort ediyor
    timestamps: true
  }
);

module.exports = mongoose.model("Activity", activitySchema);
