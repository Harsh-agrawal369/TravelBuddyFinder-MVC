const express = require("express");
const ContactRoute = express.Router();
const path = require("path");
const bodyparser= require("body-parser");
// const nodemailer = require("nodemailer");

// ContactRoute.use(bodyparser.json());
// ContactRoute.use(bodyparser.urlencoded({extended:true}));

const controller= require("../controllers/ContactController");

const session = require("express-session");
const cookieParser = require("cookie-parser");

// ContactRoute.use((req, res, next) => {
//   // Middleware logic for UserRoute
//   next();
// });


//Creating session
ContactRoute.use(cookieParser());
ContactRoute.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.sessionSecret
}))


//Setting view Engine ejs
// ContactRoute.set('view engine', 'ejs');
// ContactRoute.set('views', path.join(__dirname, "../views"));

ContactRoute.route("/contacts").get((req, res) => {
  console.log("Hell");
  res.render("contact");  
}).post(async (req, res) => {
  console.log("sup")
  await controller(req, res)
})




module.exports=ContactRoute;
