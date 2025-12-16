// backend/models/Location.js
const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { timestamps: true }); // ✅ adds createdAt & updatedAt

module.exports = mongoose.model("Location", LocationSchema);
