const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a course title"]
  },
  description: {
    type: String,
    required: [true, "Please add adescription"]
  },
  weeks: {
    type: String,
    required: [true, "Please add  number of adescription"]
  },
  tuition: {
    type: Number,
    required: [true, "Please add  tuition cose"]
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add minimum skill"],
    enum: ["beginner", "intermediate", "advanced"]
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  }
});

// Static method to calculate average of course tuition
CourseSchema.statics.getAverageCose = async function(bootcampId) {
  console.log("calculating avaerage cost..".blue);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" }
      }
    }
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    });
  } catch (error) {
    console.error(error);
  }
};

// Call getAverageCose after Save
CourseSchema.post("save", function() {
  this.constructor.getAverageCose(this.bootcamp);
});

// Call getAverageCose before remove
CourseSchema.post("remove", function() {
  this.constructor.getAverageCose(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
