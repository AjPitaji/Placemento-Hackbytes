const express = require("express");
const router = express.Router();
const CompanyModel = require("../models/companyModel");
const profileModel = require("../models/profileModel");
let color = "#e8e230";

router.get("/", async (req, res) => {
  const user = await profileModel.findOne({ Name: req.session.username });
  if (!user) {
    // Handle the case when the user is not found
    return res.redirect("/login");
  }
  const attempts = user.mcqMarks;
  const cattempts = user.codingMarks;
  const companies = await CompanyModel.find({});

  const companiesWithLogo = companies.reduce((acc, company) => {
    acc[company.name] = company.logo;
    return acc;
  }, {});

  const attemptsWithLogo = attempts.map((attempt) => {
    const companyLogo = companiesWithLogo[attempt.company];
    return {
      company: attempt.company,
      marks: attempt.marks,
      logo: companyLogo,
    };
  });

  const uniqueContests = [];
  const cattemptsWithLogo = cattempts.reduce((acc, cattempt) => {
    const companyLogo = companiesWithLogo[cattempt.company];
    const contestKey = `${cattempt.company}_${cattempt.contestCode}`;
    if (!uniqueContests.includes(contestKey)) {
      acc.push({
        company: cattempt.company,
        marks: cattempt.marks,
        logo: companyLogo,
        contestCode: cattempt.contestCode,
      });
      uniqueContests.push(contestKey);
    }
    return acc;
  }, []);

  res.render("profile.ejs", {
    name: req.session.username,
    attempts: attemptsWithLogo,
    cattempts: cattemptsWithLogo,
    color: color,
  });
});

module.exports = router;
