const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middlewares/auth");

// Create note (admin only)
router.post("/create", auth("admin"), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: "Title and content required" });

    const note = await Note.create({ title, content, createdBy: req.user.id });
    res.json({ success: true, message: "Note created", note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all notes (public)
router.get("/all", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete note (admin only)
router.delete("/delete/:id", auth("admin"), async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
