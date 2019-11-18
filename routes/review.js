const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/Review");

const advancedResults = require("../middleware/advanceResult");
const { protect, authorize } = require("../middleware/auth");

const { getReviews, getReview } = require("../controllers/review");

router.route("/").get(
  advancedResults(Review, {
    path: "bootcamp",
    select: "name description"
  }),
  getReviews
);

router.route("/:id").get(getReview);

module.exports = router;
