//server.js kodu 
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const placeRoutes = require("./routes/placeRoutes");
const savedRoutes = require("./routes/savedRoutes");
const activityRoutes = require("./routes/activityRoutes");
const routeRoutes = require("./routes/routeRoutes");
const userRoutes = require('./routes/userRoutes');
const recommendationRoutes = require("./routes/recommendationRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.send('Tour backend çalışıyor 🚀');
});

// Rotalar
app.use('/api/auth', authRoutes);
app.use("/api/places", placeRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/routes", routeRoutes);
app.use('/api/user', userRoutes);
app.use("/api/recommendations", recommendationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor...`));
