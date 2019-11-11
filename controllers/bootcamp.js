const Bootamp = require("../models/Bootcamp");

/* 
@desc       Get All Bootcamps
@route      GET /api/v1/bootcamps
@access     Public
*/
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Show all bootcamps"
  });
  next();
};

/* 
@desc       Get Single Bootcamps
@route      GET /api/v1/bootcamps/:id
@access     Public
*/
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Get Single bootamp for ${req.params.id}`
  });
  next();
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
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* 
@desc       Update a Bootcamp
@route      PUT /api/v1/bootcamps/:id
@access     Private
*/
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update bootamps for ${req.params.id}`
  });
  next();
};

/* 
@desc       Delete a Bootcamp
@route      DELETE /api/v1/bootcamps/:id
@access     Private
*/
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete bootamp for ${req.params.id}`
  });
  next();
};
