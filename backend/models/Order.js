const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "EGP" },
    provider: { type: String, default: "dummy" }, 
    reference: String,
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
