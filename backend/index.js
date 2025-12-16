const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db");

const app = express();

// Global error logging for crashes
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

// Connect DB with logging
(async () => {
  try {
    await connectDB();
    console.log("connectDB completed");
  } catch (err) {
    console.error("Error in connectDB:", err);
  }
})();

app.use(cors({
  origin: [
    "https://gallery-project-rose.vercel.app",
    "http://localhost:5500",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url, "Origin:", req.headers.origin);
  next();
});

// Routes
let mediaRoutes, authRoutes, noteRoutes, locationRoutes;
try {
  mediaRoutes = require("./routes/mediaRoutes");
  authRoutes = require("./routes/authRoutes");
  noteRoutes = require("./routes/noteRoutes");
  locationRoutes = require("./routes/location.routes");
  console.log("Routes loaded successfully");
} catch (err) {
  console.error("Error loading routes:", err);
}

if (mediaRoutes) app.use("/api/media", mediaRoutes);
if (authRoutes) app.use("/api/auth", authRoutes);
if (noteRoutes) app.use("/api/notes", noteRoutes);
if (locationRoutes) app.use("/api/location", locationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
