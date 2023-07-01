const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const profileSchema = new Schema({
  Name: String,
  Email: String,
  Password: String,
  mcqMarks: [
    {
      company: String,
      marks: Number,
    },
  ],
  codingMarks: [
    {
      company: String,
      marks: Number,
      contestCode: String,
    },
  ],
});
module.exports = mongoose.model("profile", profileSchema);
