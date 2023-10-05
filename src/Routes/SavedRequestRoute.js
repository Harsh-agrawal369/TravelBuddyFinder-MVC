const express = require("express");
const SavedRequestRoute = express();
const bodyparser= require("body-parser");
const path = require("path");
const Register = require("../models/register");
const Request= require("../models/requests");
const SavedRequest = require("../models/SavedRequests");

// const controller= require("../controllers/SavedRequestController");
const Auth = require("../middleware/Auth");

const session = require("express-session");
const cookieParser = require("cookie-parser");

const controller= require("../controllers/SavedRequestController");

SavedRequestRoute.use(bodyparser.json());
SavedRequestRoute.use(bodyparser.urlencoded({extended:true}));

// Creating session
SavedRequestRoute.use(cookieParser());
SavedRequestRoute.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.sessionSecret
}));


SavedRequestRoute.use((req, res, next) => {
    if (req.session && req.session.user_id) {
        // Session is available, continue to the next middleware/route
        next();
    } else {
        // Handle case where session is not available
        res.status(401).send('Unauthorized');
    }
});

// Setting view Engine ejs
SavedRequestRoute.set('view engine', 'ejs');
SavedRequestRoute.set('views', path.join(__dirname, "../views"));




SavedRequestRoute.get("/LikedRequest",Auth.isLogin, async (req,res) => {
    try{
        
        const user = await Register.findOne({_id: req.session.user_id});

        //To get liked request mostly one month of today's date
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 1);


        const Flight = await SavedRequest.find({$and: [{userId: req.session.user_id}, {mode: "flight"} ]});
        const Flights = [];
        for(let i=0; i<Flight.length; i++ ){
            const req = await Request.RequestsFlight.findOne({$and: [{_id: Flight[i].requestId}, { date: { $gte: currentDate } }]});
            if(req!=null){
                Flights.push(req);
            }
            
        }

        const Train = await SavedRequest.find({$and: [{userId: req.session.user_id}, {mode: "train"} ]});
        const Trains = [];
        for(let i=0; i<Train.length; i++ ){
            const req = await Request.RequestsTrain.findOne({$and: [{_id: Train[i].requestId}, { date: { $gte: currentDate } }]});
            if(req!=null){
                Trains.push(req);
            }
            
        }

        const Cab = await SavedRequest.find({$and: [{userId: req.session.user_id}, {mode: "cab"} ]});
        const Cabs = [];
        for(let i=0; i<Cab.length; i++ ){
            const req = await Request.RequestsCab.findOne({$and: [{_id: Cab[i].requestId}, { date: { $gte: currentDate } }]});
            if(req!=null){
                Cabs.push(req);
            }
            
        }

        res.render("LikedRequests", {name: user.Name, flight: Flights, train: Trains, cab: Cabs});
    }catch(err){
        console.log(err);
        res.render("/login", {errorMessage: "Internal Server Error!"});
    }
});

//Saving Train Request
SavedRequestRoute.get("/savetrain/:id",Auth.isLogin, controller.SaveTrain);

//Saving Flight Request
SavedRequestRoute.get("/saveflight/:id",Auth.isLogin, controller.SaveFlight);

//Saving Cab Request
SavedRequestRoute.get("/savecab/:id",Auth.isLogin, controller.SaveCab);

//Removing Request from Saved
SavedRequestRoute.get("/Unsave/:id",Auth.isLogin, controller.UnSave);

//Removing Requests from Liked page
SavedRequestRoute.get("/UnsaveLiked/:id",Auth.isLogin, controller.UnsaveLiked);

module.exports=SavedRequestRoute;