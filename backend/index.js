// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");

const app = express();

// Connect DB
connectDB();

// CORS – allow your Vercel frontend
app.use(cors({
  origin: "https://YOUR-FRONTEND-NAME.vercel.app", // ← change this
  credentials: false
}));

// Middleware
app.use(express.json());

// Routes
const mediaRoutes = require("./routes/mediaRoutes");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const locationRoutes = require("./routes/location.routes");

// Route prefixes (ONLY ONCE)
app.use("/api/media", mediaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/location", locationRoutes);

// Start server (ONLY ONCE)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
