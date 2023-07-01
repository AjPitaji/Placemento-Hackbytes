const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const questionSchema = new Schema({
  numbers: Number,
  question: String,
  snippet: String,
  option1: String,
  option2: String,
  option3: String,
  option4: String,
  answers: String,
  company: String,
});
module.exports = mongoose.model("question", questionSchema);
