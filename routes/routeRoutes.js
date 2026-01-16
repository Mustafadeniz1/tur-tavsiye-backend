//routeRoutes.js backend Sadece Rota Kaydetmek için 
const express = require("express");
const { saveRoute, getSavedRoutes, removeSavedRoute } = require("../controllers/savedRouteController");
const { verifyToken } = require("../controllers/authController");

const router = express.Router();

router.post("/add", verifyToken, saveRoute);
router.get("/list", verifyToken, getSavedRoutes);
router.delete("/remove/:id", verifyToken, removeSavedRoute);

module.exports = router;