const User =
  require("../models/User");

const {
  getDistance,
} = require("geolib");

const getWorkers =
  async (req, res) => {

    try {

      const {
        lat,
        lng,
      } = req.query;

      let workers =
        await User.find({
          role: {
            $in: [
              "labour",
              "trowel",
              "contractor",
            ],
          },
        });

      if (lat && lng) {

        workers =
          workers.map(
            (worker) => {

             let distance = 0;

if (
  worker.location &&
  worker.location.lat &&
  worker.location.lng
) {

  distance =
    getDistance(
      {
        latitude:
          Number(lat),

        longitude:
          Number(lng),
      },
      {
        latitude:
          Number(
            worker.location.lat
          ),

        longitude:
          Number(
            worker.location.lng
          ),
      }
    );
}

              return {
                ...worker._doc,

                distance,
              };
            }
          );

        workers.sort(
          (a, b) =>
            a.distance -
            b.distance
        );
      }

      res.json(workers);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
};

module.exports = {
  getWorkers,
};