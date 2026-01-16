const Activity = require("../models/Activity");

const CATEGORIES = ["museum", "culture", "restaurant", "hotel"];

// basit ağırlıklar (istersen sonra ML ile değiştiririz)
const WEIGHTS = {
  CATEGORY_OPEN: 3,
  PLACE_VIEW: 1,
  PLACE_SAVE: 5,
  ROUTE_SAVE: 2
};

function normalizeScores(scoreMap) {
  const total = Object.values(scoreMap).reduce((a, b) => a + b, 0);
  if (total === 0) return CATEGORIES.map(c => ({ category: c, score: 0 }));
  return CATEGORIES
    .map(c => ({ category: c, score: +(scoreMap[c] / total).toFixed(3) }))
    .sort((a, b) => b.score - a.score);
}

const getCategoryRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const acts = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(500).lean();

    const scores = Object.fromEntries(CATEGORIES.map(c => [c, 0]));

    for (const a of acts) {
      const w = WEIGHTS[a.action] || 0;
      if (!w) continue;

      // sadece bizim 4 kategoriyi say
      if (a.category && scores[a.category] !== undefined) {
        scores[a.category] += w;
      }
    }

    res.json({
      userId,
      scores: normalizeScores(scores),
      raw: scores
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCategoryRecommendations };
