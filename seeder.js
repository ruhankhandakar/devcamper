const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load config
dotenv.config({ path: "./config/config.env" });

// Load models
const BootCamp = require("./models/Bootcamp");
const Course = require("./models/Course");

// Connect to DB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON Files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await BootCamp.create(bootcamps);
    await Course.create(courses);

    console.log("Successfully saved data to DB".green.bold.inverse);
    process.exit(1);
  } catch (error) {
    console.log(error.red.inverse);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await BootCamp.deleteMany();
    await Course.deleteMany();

    console.log("Successfully delete data from DB".red.underline.inverse);
    process.exit(1);
  } catch (error) {
    console.log(error.yellow.inverse);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
