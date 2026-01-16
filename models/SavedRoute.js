const mongoose = require("mongoose");

const savedRouteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  startLat: { type: Number, required: true },
  startLng: { type: Number, required: true },
  targetLat: { type: Number, required: true },
  targetLng: { type: Number, required: true },

  mode: { type: String, required: true }, // CAR / WALK / TRANSIT / FLIGHT
  distanceKm: { type: Number, required: true },
  durationMin: { type: Number, required: true },

  title: { type: String, default: "Kaydedilen Rota" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SavedRoute", savedRouteSchema);
