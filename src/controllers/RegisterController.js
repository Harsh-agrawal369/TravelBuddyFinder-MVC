const Register = require("../models/register");
const bcrypt = require("bcryptjs");


//Signup Control Function
const Signup = async (req, res) => {
    const {name, email, gender, contact, password, confirmPassword} = req.body;

    try{
        const users = await Register.findOne({Email: email});
        if(users!=null){
            res.render("signup", {errorMessage: "Email already in use"});
        } else if(password!=confirmPassword){
            res.render("signup", {errorMessage: "Passwords does not match"});
        } else{
            let hashedpassword = await bcrypt.hash(password, 8);
            const user= new Register({
                Name: name,
                Email: email,
                Gender: gender,
                Contact: contact,
                Password: hashedpassword
            })

            const Nuser = await user.save();
            res.status(201).render("login", {errorMessage: "User Registered! Log in to continue"})

        }

    }catch(err){
        console.log(err);
        res.render("login", {errorMessage: "Internal server error"});
    }
}

//Login control Function
const Login = async (req,res) => {
    const { email, password } = req.body;
    try{
        const user = await Register.findOne({Email: email});
        if(user!=null){
            const hashedPassword = user.Password;
            const match = await bcrypt.compare(password, hashedPassword);
            if (match) {
                req.session.user_id = user._id;
                return res.redirect("/index");
            } else {
                // console.log(await bcrypt.hash(password, 8));
                return res.render("login", { errorMessage: "Wrong Password!" });
            }
        }else{
            return res.render("login", { errorMessage: "Account does not exist! Sign-up to continue" });
        }
    }catch(err){
        console.log(err);
        res.render("login", {errorMessage: "Internal server error"});
    }
}


//Password Updation Control Function
const UpdatePassword = async (req,res) => {

    try{
        const {Password,confirmPassword} = req.body;
        const user = await Register.findOne({_id: req.session.user_id});
        if(Password!=confirmPassword){
            return res.render("changepass", {name: user.Name, error: "Passwords do not match!"});
        }
        const hashedPassword = user.Password;

        const match = await bcrypt.compare(Password, hashedPassword);

        if(match){
            return res.render("changepass", { name: user.Name,error: "Password cannot be same as old password!" });
        }else{
            let newhashedpassword = await bcrypt.hash(Password, 8);
            await Register.findOneAndUpdate(
                {_id: req.session.user_id},
                {$set: {Password: newhashedpassword}}
            );
            res.render("changepass", {name: user.Name, error: "password Updated Successfully!"});
        }

    }catch(err){
        console.log(err);
        res.render("login", {errorMessage: "Internal server error"});
    }
}

const Editdetails = async (req,res) => {
    try{
        const {name , contact, gender} = req.body;

        if(name!=""){
            await Register.findOneAndUpdate(
                {_id: req.session.user_id},
                {$set: {Name: name}}
            );
        }
        if(contact!=""){
            await Register.findOneAndUpdate(
                {_id: req.session.user_id},
                {$set: {Contact: contact}}
            );
        }
        if(gender!="Gender"){
            await Register.findOneAndUpdate(
                {_id: req.session.user_id},
                {$set: {Gender: gender}}
            );
        }
        const user = await Register.findOne({_id: req.session.user_id});
        res.render("myprofile",{name: user.Name, data: user, Message: "Details Updated Successfully!"})
    }catch(err){
        console.log(err);
        res.render("login", {errorMessage: "Internal server error"});
    }
}


// Exporting Functions
module.exports = {
    Signup, 
    Login, 
    UpdatePassword,
    Editdetails,
};