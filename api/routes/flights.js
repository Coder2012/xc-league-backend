const express = require("express");
const router = express.Router();

const FlightsController = require('../controllers/flights');

// Handle incoming GET requests to /flights
router.post("/all", FlightsController.flights_get_all);
router.get("/pilots", FlightsController.get_pilots);
router.post("/dates", FlightsController.get_dates);
router.post("/date", FlightsController.flights_get_date);
router.get("/export", FlightsController.generate_report);
router.get("/scraper", FlightsController.scrapeLatest);

module.exports = router;