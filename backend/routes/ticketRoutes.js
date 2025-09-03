const express = require("express");
const QRCode = require("qrcode");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();


router.post("/book", protect, authorize("user"), async (req, res) => {
  try {
    const { eventId, seatNumber } = req.body;
    const userId = req.user.id;

    console.log("📌 Booking request:", { eventId, seatNumber, userId });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const seat = event.seats.find((s) => s.number === seatNumber);
    console.log("🎯 Found seat:", seat);

    if (!seat) {
      return res.status(400).json({ message: "Seat not found in this event ❌" });
    }

    if (seat.isBooked) {
      console.log("⚠️ Seat already marked as booked in event data");
      return res.status(400).json({ message: "Seat already booked in event ❌" });
    }

    const existingTicket = await Ticket.findOne({ event: eventId, seatNumber });
    if (existingTicket) {
      console.log("⚠️ Existing ticket found in DB:", existingTicket);
      return res.status(400).json({ message: "Seat already booked in DB ❌" });
    }


    seat.isBooked = true;
    await event.save();

    const qrPayload = { eventId, seatNumber, userId };
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrPayload));

    let ticket = await Ticket.create({
      event: eventId,
      user: userId,
      seatNumber,
      price: seat.price ?? 0,
      qrCode: qrCodeDataURL,
    });

    ticket = await ticket.populate("event", "title price date location");
    ticket = await ticket.populate("user", "name email");

    res.status(201).json(ticket);
  } catch (err) {
    console.error("❌ createTicket error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



router.get("/my-tickets", protect, authorize("user"), async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate("event", "title price date location");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("event", "title price date location")
      .populate("user", "name email");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.post("/scan/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.scanned) {
      return res.status(400).json({ message: "Ticket already scanned" });
    }

    ticket.scanned = true;
    await ticket.save();

    res.json({ message: "✅ Ticket scanned successfully", ticket });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
