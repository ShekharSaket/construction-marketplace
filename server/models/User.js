const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "labour", "trowel", "contractor"],
    required: true,
  },
  level: {
    type: Number,
    default: 3,
  },
  xp: {
    type: Number,
    default: 0,
  },
  experiencePoints: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  pricePerDay: {
    type: Number,
  },
  available: {
    type: Boolean,
    default: true,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  // NEW FIELDS: Worker Rating System
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);