const Contact = require("../models/Contacts");
const nodemailer = require("nodemailer");


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_GMAIL,
        pass: process.env.AUTH_PASSWORD
    }
})

const SendMailAdmin = async (firstname, lastname, email, contact, message) => {
    let mailOptions = {
        from: process.env.AUTH_GMAIL,
        to: [process.env.ADMIN1_GMAIL, process.env.ADMIN2_GMAIL], 
        subject: 'New Contact Query on TravelBuddyFinder',
        html: `<body style="font-family: Arial, sans-serif;background-color: #ffffff;text-align: center;margin: 0;padding: 0;">
            <div class="container" style="max-width: 600px;margin: 0 auto;background-color: #000;padding: 20px;border-radius: 10px;margin-top: 50px;box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h1 style="color:#bfbfbf">Hey Admin!</h1>
            <h3 style="padding-bottom: 20px; color:white">Somebody is trying to contact you.</h3>
            <p style="color:white; font-size: 0.85em">Name: ${firstname} ${lastname}</p>
            <p style="color:white; font-size: 0.85em">Email: ${email}</p>
            <p style="color:white; font-size: 0.85em">Contact No: : ${contact}</p>
            <p style="color:white; font-size: 0.85em">Message: ${message}</p>
            <br>
                <p style= "font-style: italic;color: #02bcbf;" class="signature">Best Regards<br>Team Travel Buddy</p>
            </div>
        </body>`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email Sent to admins!" + info.response);
        }
    })
}

const SendMailUser = async (firstname, email) => {
    let mailOptions = {
        from: process.env.AUTH_GMAIL,
        to: email, 
        subject: 'Thank You for contacting us.',
        html: `<body style="font-family: Arial, sans-serif;background-color: #ffffff;text-align: center;margin: 0;padding: 0;">
                    <div class="container" style="max-width: 600px;margin: 0 auto;background-color: #000;padding: 20px;border-radius: 10px;margin-top: 50px;box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <h1 style="padding-bottom: 20px; color:#bfbfbf">Hello ${firstname}!</h1>
                        <p style="color:white; font-size: 1em">Thank you for contacting us. We appreciate your time and efforts. We have received your query and we will try to solve your query as soon as possible.</p>
                        <br>
                        <p style= "font-style: italic;color: #02bcbf;" class="signature">Best Regards<br>Team Travel Buddy</p>
                    </div>
        </body>`
};
    
    

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log("Email Sent!" + info.response);
        }
    })
}


const NewQuerys = async (req, res) => {
    console.log("Hello! I'm Stuck Here.")
    try{
        const {firstname, lastname, contact, message, email} = req.body;
        console.log(firstname);
        const newquery = new Contact({
            name: firstname + " " + lastname,
            message: message,
            email: email,
            contact: contact,
            resolved: 0
        })

        const nquery = await newquery.save();
        if(nquery){
            console.log("Message saved");
        }
        SendMailAdmin(firstname,lastname,email,contact,message);
        SendMailUser(firstname,email);
        res.status(204).send();
    }catch(err){
        console.log(err);
        res.render("login", {errorMessage: "Internal server error! "});
    }
}

module.exports= NewQuerys ;