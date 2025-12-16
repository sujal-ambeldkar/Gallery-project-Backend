// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");

const app = express();

// Connect DB
connectDB();

// CORS – allow your frontend(s)
app.use(cors({
  origin: [
    "https://gallery-project-rose.vercel.app", // Vercel frontend
    "http://localhost:5500",                   // optional local testing
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
}));

// DO NOT add app.options("*", ...) – it is causing the path-to-regexp error

app.use(express.json());

// Routes
const mediaRoutes = require("./routes/mediaRoutes");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const locationRoutes = require("./routes/location.routes");

app.use("/api/media", mediaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/location", locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
