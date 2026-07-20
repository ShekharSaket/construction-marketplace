const express = require("express");

const {
  createBooking,
  completeBooking, // Note: You imported this but haven't made a route for it yet!
  getBookings,
  getWorkerBookings,
  submitReview, // NEW: Import the review function
} = require("../controllers/bookingController");

const router = express.Router();

router.get("/worker/:workerId", getWorkerBookings);
router.post("/", createBooking);
router.get("/", getBookings);

// NEW ROUTE: Submit a rating and review for a completed job
router.post("/:bookingId/review", submitReview);
router.put("/:id/complete", completeBooking);

module.exports = router;