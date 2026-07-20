const express = require("express");

const {
  getWorkers,
} = require("../controllers/workerController");

const router = express.Router();

router.get("/", getWorkers);

module.exports = router;