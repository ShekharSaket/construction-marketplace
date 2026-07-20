const Razorpay = require("razorpay");
const crypto = require("crypto");
// 1. IMPORT THE BOOKING MODEL
const Booking = require("../models/Booking"); 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_order",
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId, // 2. EXTRACT THE BOOKING ID FROM THE FRONTEND REQUEST
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      
      // 3. UPDATE THE STATUS TO "PAID" IN YOUR DATABASE
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, { status: "paid" });
      }

      res.json({
        success: true,
        message: "Payment Verified and Status Updated",
      });

    } else {
      res.status(400).json({
        success: false,
        message: "Invalid Signature",
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Verification Failed",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};