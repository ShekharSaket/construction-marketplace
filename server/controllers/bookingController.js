const { io } = require("../server");
const Booking = require("../models/Booking");
const User = require("../models/User");

const createBooking = async (req, res) => {
  try {
    // 1. Extract 'location' from the incoming request body
    const { customer, workers, workDate, location } = req.body;

    let totalAmount = 0;
    let commission = 0;

    for (const item of workers) {
      const worker = await User.findById(item.worker);
      if (!worker) continue;

      // Use 'item' (from frontend) instead of 'worker' (from DB)
      totalAmount += Number(item.pricePerDay); 

      if (worker.role === "labour") commission += 5;
      if (worker.role === "trowel") commission += 10;
      if (worker.role === "contractor") commission += 100;
    }

    // 2. Save the location to the MongoDB database
    const booking = await Booking.create({
      customer,
      workers,
      totalAmount,
      commission,
      workDate,
      location, 
    });

    io.emit("new-booking", {
      message: "New Booking Received",
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = "completed";
    await booking.save();

    for (const item of booking.workers) {
      const worker = await User.findById(item.worker);
      if (worker) {
        worker.experiencePoints += 10;
        await worker.save();
      }
    }

    res.json({
      message: "Booking completed and XP updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("workers.worker");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWorkerBookings = async (req, res) => {
  try {
    const workerId = req.params.workerId;
    const bookings = await Booking.find({
      "workers.worker": workerId,
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const submitReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { workerId, rating, reviewText } = req.body;

    // 1. Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 2. Find the specific worker inside this booking
    const workerIndex = booking.workers.findIndex(
      (w) => w.worker.toString() === workerId
    );
    if (workerIndex === -1) {
      return res.status(404).json({ message: "Worker not found in this booking" });
    }

    // Prevent submitting multiple reviews for the same job
    if (booking.workers[workerIndex].rating) {
      return res.status(400).json({ message: "Review already submitted for this worker" });
    }

    // 3. Save the rating and review to the booking
    booking.workers[workerIndex].rating = rating;
    booking.workers[workerIndex].reviewText = reviewText;
    await booking.save();

    // 4. Update the Worker's overall Profile Score
    const worker = await User.findById(workerId);
    if (worker) {
      const currentTotal = worker.totalReviews || 0;
      const currentAverage = worker.averageRating || 0;

      // Calculate the new average: ((old average * old total) + new rating) / new total
      const newTotal = currentTotal + 1;
      const newAverage = ((currentAverage * currentTotal) + Number(rating)) / newTotal;

      worker.totalReviews = newTotal;
      worker.averageRating = parseFloat(newAverage.toFixed(1)); 
      await worker.save();
    }

    res.status(200).json({ message: "Review submitted successfully!", booking });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Server error while submitting review" });
  }
};

// Properly exporting all functions, including submitReview!
module.exports = {
  createBooking,
  completeBooking,
  getBookings,
  getWorkerBookings,
  submitReview, 
};