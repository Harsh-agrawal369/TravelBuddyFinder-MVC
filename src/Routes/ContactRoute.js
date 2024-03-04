const express = require("express");
const ContactRoute = express.Router();
const path = require("path");
const bodyparser= require("body-parser");

const controller= require("../controllers/ContactController");

const session = require("express-session");
const cookieParser = require("cookie-parser");

//Creating session
ContactRoute.use(cookieParser());
ContactRoute.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.sessionSecret
}))

ContactRoute.route("/contacts").get((req, res) => {
  console.log("Hell");
  res.render("contact");  
}).post(async (req, res) => {
  console.log("sup")
  await controller(req, res)
})




module.exports=ContactRoute;
