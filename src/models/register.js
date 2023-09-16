const mongoose = require("mongoose");

//Schema Created
const UserSchema = new mongoose.Schema({
    Name : {
        type:String,
        required:true
    },

    Email: {
        type:String,
        reuired:true,
        unique:true
    },

    Gender: {
        type:String,
        required:true
    },

    Contact: {
        type:Number,
        required:true,
        unique:true
    },

    Password: {
        type:String,
        required:true
    }

})

//Creating Collection
const Register = new mongoose.model("Register", UserSchema);

module.exports= Register;
