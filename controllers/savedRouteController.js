//savedRouteController.js backend
const SavedRoute = require("../models/SavedRoute");

// POST /api/routes/add
const saveRoute = async (req, res) => {
  try {
    const {
      startLat, startLng,
      targetLat, targetLng,
      mode, distanceKm, durationMin,
      title
    } = req.body;

    if (
      startLat == null || startLng == null ||
      targetLat == null || targetLng == null ||
      !mode || distanceKm == null || durationMin == null
    ) {
      return res.status(400).json({ message: "Eksik parametre" });
    }

    const doc = new SavedRoute({
      userId: req.user.id,
      startLat, startLng,
      targetLat, targetLng,
      mode,
      distanceKm,
      durationMin,
      title: title || "Kaydedilen Rota"
    });

    await doc.save();
    res.json({ message: "Rota kaydedildi", id: doc._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/routes/list
const getSavedRoutes = async (req, res) => {
  try {
    const routes = await SavedRoute
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    // Android SavedRouteUI ile uyumlu dön
    const mapped = routes.map(r => ({
      id: r._id.toString(),
      startLat: r.startLat,
      startLng: r.startLng,
      targetLat: r.targetLat,
      targetLng: r.targetLng,
      mode: r.mode,
      distanceKm: r.distanceKm,
      durationMin: r.durationMin,
      title: r.title
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rota Silme /api/routes/remove/:id
const removeSavedRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SavedRoute.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!deleted) {
      return res.status(404).json({ message: "Rota bulunamadı" });
    }

    res.json({ message: "Rota silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { saveRoute, getSavedRoutes, removeSavedRoute };
