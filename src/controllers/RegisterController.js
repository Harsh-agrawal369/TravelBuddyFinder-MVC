const Register = require("../models/register");
const bcrypt = require("bcryptjs");
const randomString = require("randomstring");
const nodemailer = require("nodemailer");
const url = require('url');
const http =  require("https");


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
        if(req.session.user_id){
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
                res.render("login", {errorMessage: "password Updated Successfully! please Login."});
            }
        }
        else{
            const {currentURL} = req.body;
            
            const urlParams = currentURL.split('?')[1];
            const token = urlParams.split('=')[1];
            const tokenData = await Register.findOne({token: token});
            if(tokenData){
                const {Password,confirmPassword} = req.body;
                const user = await Register.findOne({_id: tokenData._id});

                await Register.findOneAndUpdate(
                    {_id: user._id},
                    {$set: {token: ""}}
                );
                req.session.user_id=user._id;

                // console.log(user);
                if(Password!=confirmPassword){
                    return res.render("changepass", {error: "Passwords do not match!"});
                }
                const hashedPassword = user.Password;

                const match = await bcrypt.compare(Password, hashedPassword);

                if(match){
                    return res.render("changepass", {error: "Password cannot be same as old password!" });
                }else{
                    let newhashedpassword = await bcrypt.hash(Password, 8);
                    await Register.findOneAndUpdate(
                        {_id: user._id},
                        {$set: {Password: newhashedpassword, token: ""}}
                    );

                    res.render("login", {errorMessage: "password Updated Successfully! please Login."});
                }
            }else{
                res.render("changepass", {error: "This link has expired." });
            }
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


//Email Sending Function
const sendresetPasswordMail = async(name, email, token, currentURL) => {
    try{

        const transporter= nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.AUTH_GMAIL,
                pass: process.env.AUTH_PASSWORD
            },
            secure: false,
            requireTLS: true
        });

        // console.log(currentURL);
        let url_r = new URL(currentURL);
        let protocol = url_r.protocol;
        let host = url_r.host;

        const mailOptions = {
            from: process.env.AUTH_GMAIL,
            to: email,
            subject: 'Reset Password for your Travel Buddy finder account.',
            html: `<body style="font-family: Arial, sans-serif;background-color: #f5f5f5;text-align: center;margin: 0;padding: 0;">
            <div class="container" style="max-width: 600px;margin: 0 auto;background-color: #bef6f7;padding: 20px;border-radius: 10px;margin-top: 50px;box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #333;">Reset Password</h1>
                <p style="font-size: 16px;line-height: 1.6;color: #555;margin-bottom: 20px;">Hello <strong>${name}</strong>,</p>
                <p style="font-size: 16px;line-height: 1.6;color: #555;margin-bottom: 20px;">Please use this link to <a style="color: #007bff;text-decoration: none;" href="${protocol}//${host}/changepass?token=${token}">reset your password</a>.</p>
                <br>
                <br>
                <br>
                <br>
                <br>
                <p style= "font-style: italic;color: #888;" class="signature">Best Regards<br>Team Travel Buddy</p>
            </div>
        </body>`
        }
        await transporter.sendMail(mailOptions, (error, info) =>{
            if(error){
                console.log(error);
            }
            else{
                console.log("Mail has been sent!");
            }
        })

    }catch(err){
        console.log(err);
        res.render("login", {errorMessage: "Internal server error"});
    }
}

const ResetPassword = async (req,res) => {
    try{

        const {email, currentURL} = req.body;
        // console.log(email);

        const user = await Register.findOne({Email: email});

        if(!user){
            return res.render("forgotPassword", {error: "Email is not registered! Please enter valid email."});
        }
        else{
            // let url = new URL("https://travelbuddyfinder.onrender.com/contact");
            // console.log(url.protocol);
            // console.log(url.host);

            
            const randomstr = randomString.generate();
            const data = await Register.findOneAndUpdate({Email: email}, {$set: {token: randomstr}});
            // console.log(data);
            sendresetPasswordMail(data.Name,email,randomstr,currentURL);
            res.render("forgotPassword", {error: "Please check your inbox! A reset link has been sent."});
        }


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
    ResetPassword
};