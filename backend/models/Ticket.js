const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  qrCode: {
    type: String,
  },
  scanned: {
    type: Boolean,
    default: false,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

ticketSchema.index({ event: 1, seatNumber: 1 }, { unique: true });

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
