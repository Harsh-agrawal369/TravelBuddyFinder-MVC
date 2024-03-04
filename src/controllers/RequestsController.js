const Request = require("../models/requests");
const Register= require("../models/register");
const SavedRequest = require("../models/SavedRequests");

//New Request For Cab
const AddCabRequest = async (req, res) => {
    try {
      const user = await Register.findOne({ _id: req.session.user_id });
      console.log(req.session.user_id);
  
      if (!user) {
        // Handle the case where the user is not found
        // You might want to redirect to a login page or show an error message
        return res.status(401).render("login", { errorMessage: "User not found" });
      }
  
      const newReq = new Request.RequestsCab({
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        time: req.body.time,
        vacantspace: req.body.Vacancy,
        genderSpecification: req.body.genderspec,
        fareShare: req.body.fareshare,
        email: user.Email,         // Use user's email from the user object
        contact_num: user.Contact  // Use user's contact from the user object
      });
  
      const newR = await newReq.save();
      res.status(201).render("index", {name: user.Name, isSucessfull: 1});
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { errorMessage: "Something went wrong." });
    }
}

//New Request for Train
const AddTrainRequest = async (req, res) => {
    try {
      const user = await Register.findOne({ _id: req.session.user_id });
      console.log(req.session.user_id);
  
      if (!user) {
        // Handle the case where the user is not found
        // You might want to redirect to a login page or show an error message
        return res.status(401).render("login", { errorMessage: "User not found" });
      }
  
      const newReq = new Request.RequestsTrain({
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        Trainnumber: req.body.trainnumber,
        class: req.body.class,
        email: user.Email,         // Use user's email from the user object
        contact_num: user.Contact  // Use user's contact from the user object
      });
  
      const newR = await newReq.save();
      res.status(201).render("index", {name: user.Name,isSucessfull: 1});
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { errorMessage: "Something went wrong." });
    }
}

//New Request for Flight
const AddFlightRequest = async (req, res) => {
    try {
      const user = await Register.findOne({ _id: req.session.user_id });
      console.log(req.session.user_id);
  
      if (!user) {
        // Handle the case where the user is not found
        // You might want to redirect to a login page or show an error message
        return res.status(401).render("login", { errorMessage: "User not found" });
      }
  
      const newReq = new Request.RequestsFlight({
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        Flightnumber: req.body.flightnumber,
        class: req.body.class,
        email: user.Email,         // Use user's email from the user object
        contact_num: user.Contact  // Use user's contact from the user object
      });
  
      const newR = await newReq.save();
      res.status(201).render("index", {name: user.Name, isSucessfull: 1});
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { errorMessage: "Something went wrong." });
    }
}

//All Searching Query


//Search Query for Cabs
const SearchCab = async (req, res) => {
    const { from, to, date, time, numberofpassenger } = req.body;
  
    try {
      const user = await Register.findOne({_id: req.session.user_id});
      const reqs = await Request.RequestsCab.find({
        $and: [
          { date: date },
          { from: { $regex: new RegExp(from, 'i') } },
          { to: { $regex: new RegExp(to, 'i') } },
          { vacantspace: { $gte: numberofpassenger } },
        ]
      });

      if(time === null || time === undefined || time===""){
        let Liked = [];
        for (let i = 0; i < reqs.length; i++) {
          const isLiked = await SavedRequest.findOne({
            $and: [{ userId: req.session.user_id }, { requestId: reqs[i]._id }],
          });

          if(isLiked==null){
            Liked.push(0);
          }else{
            Liked.push(1);
          }
          // Set Liked to 1 if isLiked is truthy, otherwise set to 0
        }
        let count1 =0;
        return res.render("requests", {name: user.Name, data: reqs, mode: "cab", count: count1, isLiked: Liked});
      }
      const request = [];
      let i=0, count=0;
  
      // Convert time to minutes since midnight for comparison
      const [hours, minutes] = time.split(':').map(Number);
      const userTimeInMinutes = hours * 60 + minutes;
  
      const lowerTimeBound = userTimeInMinutes - 120 >= 0 ? userTimeInMinutes - 120 : 1440 + (userTimeInMinutes - 120);
      const upperTimeBound = (userTimeInMinutes + 120) % 1440;
      for( i=0; i<reqs.length; i++){
        const [hours, minutes] = reqs[i].time.split(':').map(Number);
        const userTimeInMinutesreq = hours * 60 + minutes;
  
        if(userTimeInMinutesreq>lowerTimeBound && userTimeInMinutesreq<upperTimeBound){
          request[count]=reqs[i];
          count++
        }
      }
      
      let Liked = [];
      for (let i = 0; i < request.length; i++) {
        const isLiked = await SavedRequest.findOne({
          $and: [{ userId: req.session.user_id }, { requestId: request[i]._id }],
        });

        if(isLiked==null){
          Liked.push(0);
        }else{
          Liked.push(1);
        }
        // Set Liked to 1 if isLiked is truthy, otherwise set to 0
      }
      let count1 =0;
      // console.log(Liked);
      res.render("requests", {name: user.Name, data: request, count: count1, isLiked: Liked, mode: "cab" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ errorMessage: "Internal server error!" });
    }
}

//Search query For Train
const SearchTrain = async (req, res) => {
  const { departure_date, TrainNumber } = req.body;

  try {
    const reqs = await Request.RequestsTrain.find({
      $and: [{ date: departure_date }, { Trainnumber: TrainNumber }],
    });
    const user = await Register.findOne({ _id: req.session.user_id });

    let Liked = [];
    for (let i = 0; i < reqs.length; i++) {
      const isLiked = await SavedRequest.findOne({
        $and: [{ userId: req.session.user_id }, { requestId: reqs[i]._id }],
      });

      if(isLiked==null){
        Liked.push(0);
      }else{
        Liked.push(1);
      }
       // Set Liked to 1 if isLiked is truthy, otherwise set to 0
    }
    let count =0;
    res.render("requests", { name: user.Name, data: reqs, mode: "train", count: count, isLiked: Liked });
  } catch (err) {
    console.log(err);
    res.render("login", { errorMessage: "Something went Wrong! " });
  }
};


//Search Query for Flight
const SearchFlight = async  (req, res) => {
    const {departure_date, flightNumber} = req.body;
    // console.log(departure_date);
    try{
      const reqs = await Request.RequestsFlight.find({$and: [{date: departure_date}, {Flightnumber: flightNumber} ] });
      const user = await Register.findOne({_id: req.session.user_id});

      let Liked = [];
      for (let i = 0; i < reqs.length; i++) {
        const isLiked = await SavedRequest.findOne({
          $and: [{ userId: req.session.user_id }, { requestId: reqs[i]._id }],
        });

        if(isLiked==null){
          Liked.push(0);
        }else{
          Liked.push(1);
        }
        // Set Liked to 1 if isLiked is truthy, otherwise set to 0
      }
      let count =0;
      res.render("requests", {name: user.Name, data: reqs, mode: "flight", count: count, isLiked: Liked});
  
    } catch(err){
      console.log(err);
      res.render("login", {errorMessage: "Internal server error! "});
    }
    
}



module.exports={
    AddCabRequest,
    AddTrainRequest,
    AddFlightRequest,
    SearchTrain,
    SearchFlight,
    SearchCab
}