const Contact = require("../models/Contacts");
const nodemailer = require("nodemailer");


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_GMAIL,
        pass: process.env.AUTH_PASSWORD
    }
})

const SendMailAdmin = async (firstname, lastname, email, contact, message) => {
    var mailOptions = {
        from: process.env.AUTH_GMAIL,
        to: [process.env.ADMIN1_GMAIL, process.env.ADMIN2_GMAIL], 
        subject: 'New Contact Query on TravelBuddyFinder',
        text: 'Hey Admin! Somebody is trying to contact you.'+'\n\nName: ' + firstname + ' ' + lastname + '\nEmail: ' + email + '\nContact No: ' + contact + '\nMessage: ' + message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            // console.log("Email Sent!" + info.response);
        }
    })
}

const SendMailUser = async (firstname, email) => {
    var mailOptions = {
        from: process.env.AUTH_GMAIL,
        to: email, 
        subject: 'Thank You for your feedback.',
        text: 'Hello ' + firstname+ '!'+ '\n\nThank you for contacting us.' + '\nWe appreciate your time and efforts. We will try to solve your query as soon as possible.' + '\n\n\n\n\n\nBest Regards' + '\nTeam Travel Buddy'
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            // console.log("Email Sent!" + info.response);
        }
    })
}


const NewQuery = async (req, res) => {
    try{
        const {firstname, lastname, contact, message, email} = req.body;

        const newquery = new Contact({
            name: firstname + " " + lastname,
            message: message,
            email: email,
            contact: contact,
            resolved: 0
        })

        const nquery = await newquery.save();

        SendMailAdmin(firstname,lastname,email,contact,message);
        SendMailUser(firstname,email);
        res.status(204).send();
    }catch(err){
        console.log(err);
        res.render("login", {errorMessage: "Internal server error! "});
    }
}
module.exports={
    NewQuery
};