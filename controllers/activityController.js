//activityController.js
const Activity = require("../models/Activity");

const recordActivity = async (req, res) => {
  try {
    const { action, placeId, category } = req.body;

    const act = new Activity({
      userId: req.user.id,
      placeId,
      action,
      category
    });

    await act.save();
    res.json({ message: "Aktivite kaydedildi." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { recordActivity };
