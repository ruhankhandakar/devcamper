const Bootamp = require("../models/Bootcamp");

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
      data: bootamps
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* 
@desc       Get Single Bootcamps
@route      GET /api/v1/bootcamps/:id
@access     Public
*/
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootamp = await Bootamp.findById(req.params.id);

    if (!bootamp) {
      res.status(400).json({
        success: false,
        message: "No Bootcamp found"
      });
      return;
    }

    res.status(200).json({
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
