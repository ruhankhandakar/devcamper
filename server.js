const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// DB
const connectDB = require("./config/db");

// Route files
const bootcampsRouter = require("./routes/bootcamp");

// Logger
const logger = require("./middleware/logger");

// Load the config file
dotenv.config({ path: "./config/config.env" });

// Start DB Connection
connectDB();

// Initialize express
const app = express();

// Custom Middleware
/* 
@Desc Dev logging Middleware
*/
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Router Middleware
app.use("/api/v1/bootcamps", bootcampsRouter);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT}! and running in ${process.env.NODE_ENV} mode`
  );
});

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`);

  // close server and exit process
  server.close(() => process.exit(1));
});
