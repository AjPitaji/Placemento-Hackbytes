const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
  res.render("coming_soon.ejs");
});
module.exports = router;
