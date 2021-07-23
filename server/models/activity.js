const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  title: String,
  description: String,
  time: String,
  dayOfWeek: String,
  days: [String],
  style: mongoose.Schema.Types.Mixed,
  startDate: String,
  endDate: String
});

// compile model from schema
module.exports = mongoose.model("activity", ActivitySchema);