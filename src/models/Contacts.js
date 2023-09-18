const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
    email: {type: String, required: true},
    name: {type: String, required: true},
    contact: {type: Number, required: true},
    message: {type: String},
    resolved: {type: Number, required: true}
});

const Contact= new mongoose.model("Contact", ContactSchema);

module.exports= Contact;
