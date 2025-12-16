const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

// Hardcode adminId since there's only one admin
const ADMIN_ID = "693ff9c5f5d09fed1e25a2f5";

// SAVE LOCATION
router.post("/save", async (req, res) => {
  try {
    const { lat, lng } = req.body; // match frontend keys

    if (lat == null || lng == null) {
      return res.status(400).json({ msg: "Coordinates missing" });
    }

    const location = new Location({
      user: ADMIN_ID,
      lat,
      lng
    });

    await location.save();
    console.log("✅ Location saved in DB:", location);

    res.status(201).json({ msg: "Location saved", location });
  } catch (err) {
    console.error("❌ Location save error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET ALL LOCATIONS
router.get("/all", async (req, res) => {
  try {
    const locations = await Location.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 }); // newest first
    res.json(locations);
  } catch (err) {
    console.error("❌ Fetch locations error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
