const express = require("express");
const Event = require("../models/Event");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/upcoming", protect, authorize("user"), async (req, res) => {
  try {
    const now = new Date();
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

    const upcomingEvents = await Event.find({
      date: { $gte: now, $lte: oneYearLater },
    })
      .sort({ date: 1 })
      .select("title date location");

    const notifications = upcomingEvents.map((ev) => ({
      _id: ev._id,
      title: ev.title,
      location: ev.location || "Location TBD",
      date: ev.date,
    }));

    res.json(notifications);
  } catch (err) {
    console.error("❌ Notifications error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
