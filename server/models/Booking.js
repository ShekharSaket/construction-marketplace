const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workers: [
      {
        worker: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: String,
        pricePerDay: Number,
        // NEW FIELDS: Rating & Review for this specific worker
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        reviewText: {
          type: String,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    workDate: {
      type: Date,
      required: true,
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);