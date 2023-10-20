const express = require("express");
const RequestRoute = express();
const path = require("path");
const bodyparser= require("body-parser");
const Register = require("../models/register");
const Request= require("../models/requests");

RequestRoute.use(bodyparser.json());
RequestRoute.use(bodyparser.urlencoded({extended:true}));

const controller= require("../controllers/RequestsController");
const Auth = require("../middleware/Auth");

const session = require("express-session");
const cookieParser = require("cookie-parser");

RequestRoute.use((req, res, next) => {
    // Middleware logic for UserRoute
    next();
});

//Creating session
RequestRoute.use(cookieParser());
RequestRoute.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.sessionSecret
}))


//Setting view Engine ejs
RequestRoute.set('view engine', 'ejs');
RequestRoute.set('views', path.join(__dirname, "../views"));


//Handling all get Request

//rendering request history
RequestRoute.get("/requesthistory", Auth.isLogin, async (req,res) => {
    const user = await Register.findOne({_id: req.session.user_id}); 
    const Flight = await Request.RequestsFlight.find({email: user.Email});
    const Train = await Request.RequestsTrain.find({email: user.Email});
    const Cab = await Request.RequestsCab.find({email: user.Email});
    try{
      res.render("reqhistory", {name: user.Name, flight: Flight, train: Train, cab: Cab});
    }catch(err){
      res.render("/login", {errorMessage: "something went wrong!"})
    }
})

//Rendering post new Request Train
RequestRoute.get("/postRequestTrain", Auth.isLogin, (req, res)=>{
    try{
      res.render("newRequestTrain");
    }catch{
      res.render("login", {errorMessage: "internal server error!"})
    }
})
  
//Rendering post new Request Flight
RequestRoute.get("/postRequestFlight", Auth.isLogin, (req, res)=>{
    try{
      res.render("newRequestFlight");
    }catch{
      res.render("login", {errorMessage: "internal server error!"})
    }
})
  
//Rendering post new Request Cab
RequestRoute.get("/postRequestCab", Auth.isLogin, (req, res)=>{
    try{
      res.render("newRequestCab");
    }catch{
      res.render("login", {errorMessage: "internal server error!"})
    }
})

RequestRoute.get("/requests",Auth.isLogin, (req,res) => {
    res.render("requests", {name: null});
})

RequestRoute.get("/newRequestTrain",Auth.isLogin, (req,res) => {
    res.render("newRequestTrain");
})
  
RequestRoute.get("/newRequestCab", Auth.isLogin,(req,res) => {
    res.render("newRequestCab");
})
  
RequestRoute.get("/newRequestFlight",Auth.isLogin, (req,res) => {
    res.render("newRequestFlight");
})
  
//Deleting Data Get Request

//Deleting Cab request
RequestRoute.get("/deleteRequestCab/:id", async (req,res) => {
    const {id} = req.params;
    try{
      await Request.RequestsCab.deleteOne({_id : id});
      res.redirect("/requesthistory");
    }catch(err){
      res.render("login", {errorMessage: "Internal Server Error"})
    }
})

//Deleting Train request
RequestRoute.get("/deleteRequestTrain/:id", async (req,res) => {
    const {id} = req.params;
    try{
      await Request.RequestsTrain.deleteOne({_id : id});
      res.redirect("/requesthistory");
    }catch(err){
      console.log(err);
      res.render("login", {errorMessage: "Internal Server Error"})
    }
})

//Deleting Flight request
RequestRoute.get("/deleteRequestFlight/:id", async (req,res) => {
    const {id} = req.params;
    try{
      await Request.RequestsFlight.deleteOne({_id : id});
      res.redirect("/requesthistory");
    }catch(err){
      console.log(err);
      res.render("login", {errorMessage: "Internal Server Error"})
    }
})

RequestRoute.get("/save/train/:id", async (req,res) => {
  try{
    res.status(204).send();
  }catch(err){
    console.log(err);
    res.render("login", {errorMessage: "Internal Server Error"})
  }
})

RequestRoute.get("/Unsave/train/:id", async (req,res) => {
  try{
    res.status(204).send();
  }catch(err){
    console.log(err);
    res.render("login", {errorMessage: "Internal Server Error"})
  }
})
  


//Handling Post Requests

//Handling Cab Add Post Request
RequestRoute.post("/newRequestCab",controller.AddCabRequest);

//Handling Train Add Post Request
RequestRoute.post("/newRequestTrain",controller.AddTrainRequest);

//Handling Flight Add Post Request
RequestRoute.post("/newRequestFlight",controller.AddFlightRequest);

//Handling Cab Search Post Request
RequestRoute.post("/searchCab",controller.SearchCab);

//Handling Train Search Post Request
RequestRoute.post("/searchTrain",controller.SearchTrain);

//Handling Flight Search Post Request
RequestRoute.post("/searchFlight",controller.SearchFlight);



module.exports=RequestRoute;