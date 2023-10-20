require("../middleware/googleAuth");
const express = require("express");
const UserRoute = express();
const path = require("path");
const bodyparser= require("body-parser");
const Register = require("../models/register");
const passport = require("passport");

UserRoute.use(bodyparser.json());
UserRoute.use(bodyparser.urlencoded({extended:true}));

const controller= require("../controllers/RegisterController");
const Auth = require("../middleware/Auth");

const session = require("express-session");
const cookieParser = require("cookie-parser");


//Creating session
UserRoute.use(cookieParser());
UserRoute.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.sessionSecret
}))

//Using Passport Libraries Methods
UserRoute.use(passport.initialize());
UserRoute.use(passport.session());

UserRoute.use((req, res, next) => {
  // Middleware logic for UserRoute
  next();
});

//Setting view Engine ejs
UserRoute.set('view engine', 'ejs');
UserRoute.set('views', path.join(__dirname, "../views"));


//All get Routes
UserRoute.get("/", Auth.isLogout, (req,res) => {
    res.render("login", { errorMessage: null })
})

UserRoute.get("/login", Auth.isLogout, (req,res) => {
    res.render("login", {errorMessage:null})
})

UserRoute.get("/signup", Auth.isLogout, (req,res) => {
    res.render("signup", { errorMessage: null })
})

//Rendering Faq
UserRoute.get("/faq", (req, res) => {
    res.render("faq");
})

//Rendering About Page
UserRoute.get("/about", (req, res) => {
    res.render("about");
})
  
//Rendering Index
UserRoute.get("/index", Auth.isLogin, async (req,res) => {
    const user = await Register.findOne({_id: req.session.user_id});
    try{
      res.render("index", {name: user.Name, isSucessfull:0});
    }catch(err){
      res.render("login", {errorMessage: "Internal server error!"})
    }
})

//Rendering Logout
UserRoute.get("/logout", Auth.isLogin, (req,res) => {
    try{
      req.session.destroy();
      res.redirect('/');
    }catch(err){
      console.log(err);
    }
})

//Rendering backhome
UserRoute.get("/backhome", Auth.isLogin, async (req,res) => {
    try{
      const user = await Register.findOne({ _id : req.session.user_id});
      res.render("index", {name: user.Name, isSucessfull: 0});
    } catch(err){
      res.render("index", {name: null});
    }
})
  
//Rendering myprofile
UserRoute.get("/myprofile", Auth.isLogin, async (req,res) => {
  
    const user = await Register.findOne({ _id: req.session.user_id });
    res.render("myprofile", {name: user.Name, data: user, Message: null});
})
  
//Rendering Change pass
UserRoute.get("/changepass", async (req,res) => {
    res.render("changepass", {error: null});
})

//Getting Get Request
UserRoute.get("/contact", async (req,res) => {
  res.render("contact");
})

//Rendering Forgot Password Request
UserRoute.get("/forgotPassword", Auth.isLogout, async (req,res) => {
  res.render("forgotPassword", {error: null});
})


//Google Authentiaction Routes

UserRoute.get('/SignInWithGoogle',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

UserRoute.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/failure',
}));

UserRoute.get('/auth/protected', Auth.isLogin, async (req,res) => {
  console.log(req.user._id);
  res.redirect("/index");
});

UserRoute.get('/auth/failure', async (req,res) => {
  res.redirect("/logout");
});




//All Post Requests

//Rendering SignUp post Request
UserRoute.post("/signup", controller.Signup);

//Rendering Login post Request
UserRoute.post("/login", controller.Login);

//Rendering UpdatePassword Post Request
UserRoute.post("/updatepass", controller.UpdatePassword);

//Rendering Edit Details Post Request
UserRoute.post("/editDetails", controller.Editdetails);

//Rendering Reset Password post Request
UserRoute.post("/resetPassword", controller.ResetPassword);



module.exports=UserRoute;