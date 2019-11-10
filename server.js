const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Route files
const bootcampsRouter = require("./routes/bootcamp");

// Logger
const logger = require("./middleware/logger");

// Load the config file
dotenv.config({ path: "./config/config.env" });

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
app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT}! and running in ${process.env.NODE_ENV} mode`
  );
});
