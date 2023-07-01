const express = require("express");
const router = express.Router();
const CompanyModel = require("../models/companyModel");
const profileModel = require("../models/profileModel");
const questionModel = require("../models/questionModel");

router.get("/:company", async (req, res) => {
  list = [];
  title = req.params.company;
  if (title === "Fidelity") {
    title = "Fredility";
  }
  const result = await questionModel.find({ company: title }); // Make sure to wrap this code in an async function
  result.forEach((element) => {
    list.push({
      title: title,
      number: element.numbers,
      text: element.question,
      option1: element.option1,
      option2: element.option2,
      option3: element.option3,
      option4: element.option4,
      company: element.company,
      snippet: element.snippet,
    });
  });
  res.render("mcq.ejs", { questions: list });
});

router.post("/:company", async (req, res) => {
  const title = req.params.company;
  const answers = req.body;
  const username = req.session.username;

  let score = 0;
  for (const questionId in answers) {
    const question = await questionModel.findOne({
      numbers: parseInt(questionId),
      company: title.trim(),
    });

    if (
      question &&
      question.answers &&
      question.answers.trim() === answers[questionId].trim()
    ) {
      score++;
    }
  }

  console.log("Final score:", score);

  // Find the user's previous score for the same company
  const previousScore = await profileModel.findOne(
    { Name: username, "mcqMarks.company": title },
    { "mcqMarks.$": 1 }
  );

  // Check if the user has attempted the quiz for a new company
  if (!previousScore) {
    await profileModel.findOneAndUpdate(
      { Name: username },
      { $push: { mcqMarks: { company: title, marks: score } } },
      { new: true }
    );
  }
  // Otherwise, update the existing record only if the score is higher
  else if (previousScore.mcqMarks[0].marks < score) {
    await profileModel.updateOne(
      { Name: username, "mcqMarks.company": title },
      { $set: { "mcqMarks.$.marks": score } }
    );
  }

  res.redirect("/profile");
});

module.exports = router;
