const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");

// Load the config file
dotenv.config({ path: "./config/config.env" });

// DB
const connectDB = require("./config/db");

// Route files
const bootcampsRouter = require("./routes/bootcamp");
const courseRouter = require("./routes/course");

// Start DB Connection
connectDB();

// Initialize express
const app = express();

// Express middleware
app.use(express.json());

// Custom Middleware
/* 
@Desc Dev logging Middleware
*/

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Router Middleware
app.use("/api/v1/bootcamps", bootcampsRouter);
app.use("/api/v1/courses", courseRouter);

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
