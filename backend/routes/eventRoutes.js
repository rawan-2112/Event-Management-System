const express = require("express");
const Event = require("../models/Event");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();


router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { title, description, date, location, price, rows, seatsPerRow } = req.body;
    const status = new Date(date) > new Date() ? "upcoming" : "closed";

    const event = new Event({
      title,
      description,
      date,
      location,
      price,
      status,
      seats: Event.generateSeatMap(rows || 8, seatsPerRow || 12),
      createdBy: req.user.id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/admin/summary", protect, authorize("admin"), async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    const totalEvents = events.length;
    const totalSeats = events.reduce((acc, ev) => acc + ev.seats.length, 0);
    const bookedSeats = events.reduce(
      (acc, ev) => acc + ev.seats.filter((s) => s.isBooked).length,
      0
    );
    const revenue = events.reduce(
      (acc, ev) => acc + ev.seats.filter((s) => s.isBooked).length * ev.price,
      0
    );

    res.json({
      stats: { totalEvents, totalSeats, bookedSeats, revenue },
      events,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { date } = req.body;
    const status = date ? (new Date(date) > new Date() ? "upcoming" : "closed") : undefined;

    const updateData = { ...req.body };
    if (status) updateData.status = status;

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!event) return res.status(404).json({ error: "Event not found" });

    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
