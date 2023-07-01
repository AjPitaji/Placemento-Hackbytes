const express = require("express");
const router = express.Router();
const CompanyModel = require("../models/companyModel");

const question_type = ["Multiple Choice", "Coding Questions"];
const test_images = [
  "https://media.istockphoto.com/id/1184801139/vector/online-testing-e-learning-education-concept-people-are-studying-the-application-form-vector.jpg?s=612x612&w=0&k=20&c=l2QTjm2VueMmbkG4Q34nqtem3t4N4ECO_Wo7jPfKaFY=",
  "https://img.freepik.com/free-vector/software-code-testing-concept-illustration_114360-8174.jpg?w=2000",
];

router.get("/:company", async (req, res) => {
  try {
    const title = req.params.company;
    const company = await CompanyModel.findOne({ name: title });
    if (company && company.code !== "") {
      console.log("Test menu loaded successfully");
      res.render("Tests.ejs", {
        types: question_type,
        images: test_images,
        title: title,
        code: company.code,
      });
    } else {
      res.redirect("/comingsoon");
    }
  } catch (error) {
    res.redirect("/comingsoon");
  }
});

module.exports = router;
