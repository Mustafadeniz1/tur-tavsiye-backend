// routes/placeRoutes.js
const express = require("express");
const { getNearbyPlaces, searchPlaces , getPlaceDetails} = require("../controllers/placeController");
const { verifyToken } = require("../controllers/authController");

const router = express.Router();

router.get("/nearby", verifyToken, getNearbyPlaces);
router.get("/search", verifyToken, searchPlaces); 
router.get("/details", verifyToken, getPlaceDetails); //Yeni 

module.exports = router;
