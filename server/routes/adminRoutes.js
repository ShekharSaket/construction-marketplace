const express =
  require("express");

const router =
  express.Router();

const User =
  require("../models/User");

const Booking =
  require("../models/Booking");

router.get(
  "/stats",

  async (req, res) => {

    try {

      const totalUsers =
        await User.countDocuments();

      const totalWorkers =
        await User.countDocuments({
          role: {
            $ne: "customer",
          },
        });

      const totalBookings =
        await Booking.countDocuments();

      const totalRevenue =
        totalBookings * 500;

      res.json({
        totalUsers,
        totalWorkers,
        totalBookings,
        totalRevenue,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports =
  router;