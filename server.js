const express = require("express");
const dotenv = require("dotenv");

// Load the config file
dotenv.config({ path: "./config/config.env" });

// Initialize express
const app = express();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT}! and running in ${process.env.NODE_ENV} mode`
  );
});
