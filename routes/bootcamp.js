const express = require("express");

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootCampsInRadius
} = require("../controllers/bootcamp");

const router = express.Router();

router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
