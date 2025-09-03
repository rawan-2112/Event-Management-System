const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  number: { type: String, required: true }, 
  isBooked: { type: Boolean, default: false },
});

const attendeeSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: { type: String, enum: ["Male", "Female"] },
  city: String,
});

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    bannerUrl: String,
    category: { type: String, default: "General" },
    status: {
      type: String,
      enum: ["upcoming", "active", "closed"],
      default: "upcoming",
    },
    seats: [seatSchema],
    attendees: [attendeeSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

eventSchema.statics.generateSeatMap = function (rows = 8, seatsPerRow = 12) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const seats = [];
  for (let r = 0; r < rows; r++) {
    for (let s = 1; s <= seatsPerRow; s++) {
      seats.push({ number: `${letters[r]}${s}`, isBooked: false });
    }
  }
  return seats;
};

module.exports = mongoose.model("Event", eventSchema);
