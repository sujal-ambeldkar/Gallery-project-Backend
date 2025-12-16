const Location = require("../models/Location");

// SAVE LOCATION
exports.saveLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({ msg: "Coordinates missing" });
    }

    const location = new Location({
      user: req.user.id, // must come from auth middleware
      lat,
      lng
    });

    await location.save();
    res.status(201).json({ msg: "Location saved", location });

  } catch (err) {
    console.error("❌ Location save error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET ALL LOCATIONS
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().populate("user", "username");
    res.json(locations);
  } catch (err) {
    console.error("❌ Failed to get locations:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
