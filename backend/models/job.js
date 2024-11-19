const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  skills: {
    type: Array,
    required: true,
  },
  managerid: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "0",
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pay: {
    type: String,
    required: true,
  },
  schedule: {
    type: String,
    required: true,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
