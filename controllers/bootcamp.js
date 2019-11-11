const Bootamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
/* 
@desc       Get All Bootcamps
@route      GET /api/v1/bootcamps
@access     Public
*/
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootamps = await Bootamp.find();

    res.status(200).json({
      success: true,
      counts: bootamps.length,
      data: bootamps
    });
  } catch (error) {
    next(error);
  }
};

/* 
@desc       Get Single Bootcamps
@route      GET /api/v1/bootcamps/:id
@access     Public
*/
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootamp.findById(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse("No Bootcamp found", 404));
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    });
  } catch (error) {
    next(error);
  }
};

/* 
@desc       Create a Bootcamp
@route      GET /api/v1/bootcamps
@access     Public
*/
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootamp = await Bootamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootamp
    });
  } catch (error) {
    next(error);
  }
};

/* 
@desc       Update a Bootcamp
@route      PUT /api/v1/bootcamps/:id
@access     Private
*/
exports.updateBootcamp = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

/* 
@desc       Delete a Bootcamp
@route      DELETE /api/v1/bootcamps/:id
@access     Private
*/
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return next(new ErrorResponse("No Bootcamp found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Successfully Deleted"
    });
  } catch (error) {
    next(error);
  }
};
