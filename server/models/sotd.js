const mongoose = require("mongoose");

//define a schema for Scripture of the daythe database
const SOTDSchema = new mongoose.Schema({
  creator_id: String,
  creator_name: String,
  verse: String,
  reflection: String,
  date: String
});

// compile model from schema
module.exports = mongoose.model("sotd", SOTDSchema);
