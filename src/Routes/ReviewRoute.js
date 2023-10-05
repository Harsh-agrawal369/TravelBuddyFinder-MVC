const express = require("express");
const ReviewRoute = express();
const path = require("path");
const bodyparser= require("body-parser");

ReviewRoute.use(bodyparser.json());
ReviewRoute.use(bodyparser.urlencoded({extended:true}));

const controller= require("../controllers/ReviewController");

const session = require("express-session");
const cookieParser = require("cookie-parser");

ReviewRoute.use((req, res, next) => {
  // Middleware logic for UserRoute
  next();
});

//Creating session
ReviewRoute.use(cookieParser());
ReviewRoute.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.sessionSecret
}))


//Setting view Engine ejs
ReviewRoute.set('view engine', 'ejs');
ReviewRoute.set('views', path.join(__dirname, "../views"));


//Post Request for Review
ReviewRoute.post("/rating", controller.PostReview);


module.exports=ReviewRoute
