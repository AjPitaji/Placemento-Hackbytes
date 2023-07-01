const express = require("express");
const router = express.Router();
const CompanyModel = require("../models/companyModel");
const profileModel = require("../models/profileModel");

router.get("/:code/:company", async (req, res) => {
  const title = req.params.company;

  const code = req.params.code;
  const company = await CompanyModel.findOne({ name: title });

  if (company && company.code) {
    const user = await profileModel.findOne({ Name: req.session.username });
    user.codingMarks.push({ company: title, marks: 0, contestCode: code });
    await user.save();
    res.redirect(`https://www.hackerrank.com/contests/${code}`);
  } else {
    res.send("error");
  }
});

module.exports = router;
