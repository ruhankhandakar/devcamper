const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorRresponse = require("../utils/errorResponse");
const User = require("../models/User");

// Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  //   else if(req.cookies.token){
  //       token = req.cookies.token
  //   }

  console.log(token);
  // Make sure token exists
  if (!token) {
    return next(new ErrorRresponse("Not authorized.", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorRresponse("Not authorized.", 401));
  }
});
