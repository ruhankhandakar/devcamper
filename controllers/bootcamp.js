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
      counts: bootamps.length,
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
    const bootcamp = await Bootamp.findById(req.params.id);

    if (!bootcamp) {
      res.status(400).json({
        success: false,
        message: "No Bootcamp found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: bootcamp
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
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!bootcamp) {
      res.status(400).json({
        success: false,
        message: "No Bootcamp found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
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
      res.status(400).json({
        success: false,
        message: "No Bootcamp found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Successfully Deleted"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
