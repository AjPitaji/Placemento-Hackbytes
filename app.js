require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const useragent = require("express-useragent");
const bodyParser = require("body-parser");
const { fileLoader, name } = require("ejs");
const req = require("express/lib/request");
const app = express();
const contactRoutes = require("./routes/contact");
const aboutRoutes = require("./routes/about");
const comingRoutes = require("./routes/comingsoon");
const companyRoutes = require("./routes/company");
const testmenuRoutes = require("./routes/testmenu");
const signoutRoutes = require("./routes/signout");
const mcqRoutes = require("./routes/mcq");
const profileRoute = require("./routes/profile");
const codingRoutes = require("./routes/code");
const profileModel = require("./models/profileModel");
app.use(express.static("public"));
const { Schema, model } = mongoose;
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGO_URI);
const session = require("express-session");

app.use(useragent.express());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

const marquee = "https://i.ibb.co/YNT2Q9Y/marquee-company.jpg";
const super_dream = "https://i.ibb.co/hdCbBc0/76.jpg";
const dream = "https://i.ibb.co/QkBr66c/51584.jpg";
const Day = "https://i.ibb.co/2cr5c6W/Illustration05.jpg";

let marqueedes =
  "Marquee company refers to a highly successful and well-known business organization that is usually dominant in its respective industry.";
let superdes =
  "The companies whoever offer above 10 LPA will be considered as Super Dream companies.";
let dreamdes =
  "A dream company is an organization that can help you lead a meaningful life and enjoy a rewarding career.";
let dsdes =
  "These companies are organizations that want to employ a large number of individuals as opposed to other companies that only hire a few.";

const typese = [
  { type: "Marquee Company", image: marquee, description: marqueedes },
  { type: "Super Dream Company", image: super_dream, description: superdes },
  { type: "Dream Company", image: dream, description: dreamdes },
  { type: "Day Sharing", image: Day, description: dsdes },
];

list = [];
let msg = "";

app.get("/login", function (req, res) {
  res.render("login.ejs", { msg: msg });
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await profileModel.findOne({ Email: email });
    if (user) {
      if (user.Password === password) {
        req.session.user = user;
        req.session.username = user.Name;
        res.redirect("/");
      } else {
        res.render("login", {
          msg: "Incorrect password. Please check your credentials.",
        });
      }
    } else {
      res.render("login", {
        msg: "User not found. Please register before logging in.",
      });
    }
  } catch (err) {
    console.log(err);
    res.send("An error occurred during login");
  }
});

app.get("/", requireLogin, function (req, res) {
  // Determine the screen size
  var screenSize;
  if (req.useragent.isMobile) {
    screenSize = "small";
  } else {
    screenSize = "large";
  }

  // Render the template with the appropriate partial
  res.render("home.ejs", { types: typese, screenSize: screenSize });
});

app.post("/register", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const existingUser = await profileModel.findOne({ Email: email });
    if (existingUser) {
      res.render("login", {
        msg: "User with this email already exists. Please try a different email.",
      });
    } else {
      const newUser = await profileModel.create({
        Name: name,
        Email: email,
        Password: password,
      });
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.send("An error occurred during registration");
  }
});

app.use("/companies", requireLogin, companyRoutes);
app.use("/tests", requireLogin, testmenuRoutes);
app.use("/tests/mcq", requireLogin, mcqRoutes);
app.use("/tests/coding", requireLogin, codingRoutes);
app.use("/profile", requireLogin, profileRoute);
app.use("/about", requireLogin, aboutRoutes);
app.use("/contact", requireLogin, contactRoutes);
app.use("/comingsoon", requireLogin, comingRoutes);
app.use("/signout", signoutRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
