const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

const errorHandler = require("./middleware/error");

// Load the config file
dotenv.config({ path: "./config/config.env" });

// DB
const connectDB = require("./config/db");

// Route files
const bootcampsRouter = require("./routes/bootcamp");
const courseRouter = require("./routes/course");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const reviewRouter = require("./routes/review");

// Start DB Connection
connectDB();

// Initialize express
const app = express();

// Express middleware
app.use(express.json());

// To remove data, use:
app.use(mongoSanitize());

// Set Security Header
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate Limiting
const limiter = expressRateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});
app.use(limiter);

// prevent http param pollution
app.use(hpp());

// Enable cors
app.use(cors());

// Cookie parser middleware
app.use(cookieParser());

// Custom Middleware
/* 
@Desc Dev logging Middleware
*/

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileUpload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Router Middleware
app.use("/api/v1/bootcamps", bootcampsRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// Error Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT}! and running in ${process.env.NODE_ENV} mode`
      .yellow.bold
  );
});

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`.red);

  // close server and exit process
  server.close(() => process.exit(1));
});
