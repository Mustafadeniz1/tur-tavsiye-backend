//savedRoutes.js (backend ile uygualama ApiService bağlantı noktası)
const express = require("express");
const { savePlace, getSavedPlaces, removeSavedPlace } = require("../controllers/savedPlaceController");
const { verifyToken } = require("../controllers/authController");
const { getSavedLists } = require("../controllers/savedListController");

const router = express.Router();

router.post("/add", verifyToken, savePlace);
router.get("/list", verifyToken, getSavedPlaces);
router.get("/lists", verifyToken, getSavedLists);
router.delete("/remove", verifyToken, removeSavedPlace);

module.exports = router;
