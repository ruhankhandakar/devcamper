const Bootamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

/* 
@desc       Get All Bootcamps
@route      GET /api/v1/bootcamps
@access     Public
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // copy query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(req.query);

  // create operators ($gt, $lt, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding Resource
  query = Bootamp.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Executing query
  const bootamps = await query;

  res.status(200).json({
    success: true,
    counts: bootamps.length,
    data: bootamps
  });
});

/* 
@desc       Get Single Bootcamps
@route      GET /api/v1/bootcamps/:id
@access     Public
*/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse("No Bootcamp found", 404));
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

/* 
@desc       Create a Bootcamp
@route      GET /api/v1/bootcamps
@access     Public
*/
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootamp = await Bootamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootamp
  });
});

/* 
@desc       Update a Bootcamp
@route      PUT /api/v1/bootcamps/:id
@access     Private
*/
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(new ErrorResponse("No Bootcamp found", 404));
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

/* 
@desc       Delete a Bootcamp
@route      DELETE /api/v1/bootcamps/:id
@access     Private
*/
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse("No Bootcamp found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Successfully Deleted"
  });
});

/* 
@desc       Get Bootcamps within a radius
@route      DELETE /api/v1/bootcamps/radius/:zipcode/:distance
@access     Private
*/
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const long = loc[0].longitude;

  // Calc radius using radians;
  // Divide dist by radius of earth
  // Earth Radius = 3963 mi / 6378 km
  const radius = distance / 3963;

  const bootcamps = await Bootamp.find({
    location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
