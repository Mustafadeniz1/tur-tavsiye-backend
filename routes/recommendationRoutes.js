const express = require("express");
const router = express.Router();
const { verifyToken } = require("../controllers/authController");
const { getCategoryRecommendations } = require("../controllers/recommendationController");

router.get("/categories", verifyToken, getCategoryRecommendations);

module.exports = router;
