//activityRoutes.js
const express = require("express");
const { recordActivity } = require("../controllers/activityController");
const { verifyToken } = require("../controllers/authController");

const router = express.Router();

router.post("/record", verifyToken, recordActivity);

module.exports = router;
