const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  projectData: String,
  creator_id: String,
  name: String,
  dateModified: String,
});

// compile model from schema
module.exports = mongoose.model("project", ProjectSchema);
