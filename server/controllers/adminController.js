const User = require("../models/User");
const Booking = require("../models/Booking");

const getAdminStats = async (req, res) => {

  try {

    const totalUsers =
      await User.countDocuments();

    const totalWorkers =
      await User.countDocuments({
        role: {
          $in: [
            "labour",
            "trowel",
            "contractor",
          ],
        },
      });

    const totalBookings =
      await Booking.countDocuments();

    const totalRevenue =
      totalBookings * 100;

    res.json({
      totalUsers,
      totalWorkers,
      totalBookings,
      totalRevenue,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
};