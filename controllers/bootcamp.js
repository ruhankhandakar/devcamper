const Bootamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

/* 
@desc       Get All Bootcamps
@route      GET /api/v1/bootcamps
@access     Public
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootamps = await Bootamp.find();

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
