const mongoose = require("mongoose");

const SavedRequestSchema = new mongoose.Schema({
    userId : {type: String, required: true},
    requestId: {type: String, required: true},
    mode: {type: String, required: true},
    Booked: {type: String, default: 0}
})

const SavedRequest = new mongoose.model("SavedRequest", SavedRequestSchema);

module.exports = SavedRequest;