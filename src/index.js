//npm run dev
require('dotenv').config()
const express = require("express");
const app = express();
const path = require("path");
require("./db/conn");
const {json} = require("express");
const PORT = process.env.PORT || 3000;
const { default: mongoose } = require("mongoose");
const UserRoute = require("./Routes/UserRoute");
const ReviewRoute = require("./Routes/ReviewRoute");
const RequestRoute= require("./Routes/RequestRoute");
const ContactRoute= require("./Routes/ContactRoute");
const LikedRoute= require("./Routes/SavedRequestRoute");



app.use(express.json());

//Hosting Static Website
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

//Setting View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

//Transfering Requests to Routes
app.use("/", UserRoute);
app.use("/", ReviewRoute);
app.use("/", RequestRoute);
app.use("/", ContactRoute);
app.use("/", LikedRoute);

//Listening the Posrt
app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
})

// "node": ">= 0.6"
module.exports = app;