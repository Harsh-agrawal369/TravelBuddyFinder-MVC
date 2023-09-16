const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    Email: {type: String, required: true},
    Name: {type: String, required: true},
    Rating: {type: Number, required: true},
    Feedback: {type: String}
});

const Review= new mongoose.model("Review", ReviewSchema);

module.exports= Review;

