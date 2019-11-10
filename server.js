const express = require("express");
const dotenv = require("dotenv");

// Route files
const bootcampsRouter = require("./routes/bootcamp");

// Load the config file
dotenv.config({ path: "./config/config.env" });

// Initialize express
const app = express();

// Router Middleware
app.use("/api/v1/bootcamps", bootcampsRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT}! and running in ${process.env.NODE_ENV} mode`
  );
});
