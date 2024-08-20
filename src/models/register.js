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
    },

    Contact: {
        type:Number,
        unique: false,
        default: 1234567890
    },

    Password: {
        type:String,
    }
    , 
    token: {
        type: String,
        default: ""
    },
    is_online: {
        type: String,
        default: '0'
    }

},
{timestamps: true}
)

//Creating Collection
const Register = new mongoose.model("Register", UserSchema);

module.exports= Register;
