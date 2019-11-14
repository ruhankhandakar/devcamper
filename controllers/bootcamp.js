const path = require("path");

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
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, $lt, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding Resource
  query = Bootamp.find(JSON.parse(queryStr)).populate("courses");

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.replace(/,/g, " ");
    query = query.select(fields);
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.replace(/,/g, " ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bootamps = await query;

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    counts: bootamps.length,
    pagination,
    data: bootamps
  });
});

/* 
@desc       Get Single Bootcamps
@route      GET /api/v1/bootcamps/:id
@access     Public
*/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootamp.findById(req.params.id).populate("courses");

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
  const bootcamp = await Bootamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse("No Bootcamp found", 404));
  }

  bootcamp.remove();

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

/* 
@desc       Upload photo for Bootcamp
@route      DELETE /api/v1/bootcamps/:id/photo
@access     Private
*/
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse("No Bootcamp found", 404));
  }

  if (!req.files) {
    return next(new ErrorResponse("Please upload a file", 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload an image file", 400));
  }

  // Chcek file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
