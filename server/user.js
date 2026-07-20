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

  experiencePoints: {
    type: Number,
    default: 0,
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
});

const User = mongoose.model("User", userSchema);

module.exports = User;