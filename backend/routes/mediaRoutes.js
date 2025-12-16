const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const cloudinary = require("cloudinary");
const Media = require("../models/Media");
const auth = require("../middlewares/auth");


// ===========================
// Upload Media (Admin Only)
// ===========================
router.post("/upload", auth("admin"), upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded!" });
    }

    const mediaUrl = req.file.path;

    // Detect type by file extension
    let type = "image";
    if (mediaUrl.match(/\.(mp4|mov|avi|webm)$/i)) type = "video";
    else if (mediaUrl.match(/\.(mp3|wav|ogg)$/i)) type = "audio";

    // Save media in MongoDB
    const media = await Media.create({ url: mediaUrl, type });

    res.json({
      success: true,
      message: "File uploaded successfully",
      media
    });
  } catch (error) {
    console.error("UPLOAD ERROR ❌", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===========================
// Get All Media (Public)
// ===========================
router.get("/all", async (req, res) => {
  try {
    const mediaList = await Media.find().sort({ uploadedAt: -1 });
    res.json(mediaList);
  } catch (error) {
    console.error("GET MEDIA ERROR ❌", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===========================
// Delete Media (Admin Only)
// ===========================
router.delete("/delete", auth("admin"), async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "No URL provided" });

    // Remove from MongoDB
    await Media.findOneAndDelete({ url });

    // Remove from Cloudinary
    const parts = url.split("/");
    const fileName = parts[parts.length - 1].split(".")[0];
    const publicId = `media_uploads/${fileName}`;
    await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });

    res.json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR ❌", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
