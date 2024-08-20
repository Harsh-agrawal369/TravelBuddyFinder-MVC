const passport = require("passport");
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const dotenv = require("dotenv");
const Register = require("../models/register");

if(process.env.DEPLOYMENT_STATUS === "development"){
    passport.use(new GoogleStrategy ({
        clientID: process.env.GOOGLE_OAUTH_CLIENTID_DEVE,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENTSEC_DEVE,
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true,
        scope: ['email', 'profile', 'https://www.googleapis.com/auth/user.phonenumbers.read']
    },
    async function(req, accessToken, refreshToken,profile, done){
        try{
            const user = await Register.findOne({Email : profile.email});
            if(user){
                return done(null, user);
            }else{
                try{
                    const NewUser = new Register({Email: profile.email, Name: profile.displayName, Gender: profile.gender, Contact: profile.phone_number});
                    const Nuser = await NewUser.save();
                    return done(null, Nuser);
                }catch(err){
                    console.log(err);
                    return done(err);
                }
                
            }
        }
        catch(err){
            console.log(err);
            return done(err);
        }  
    }
    
    ));
} else if(process.env.DEPLOYMENT_STATUS === "Production"){
    passport.use(new GoogleStrategy ({
        clientID: process.env.GOOGLE_OAUTH_CLIENTID_PROD,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENTSEC_PROD,
        callbackURL: "https://travelbuddyfinder.onrender.com/auth/google/callback",
        passReqToCallback: true,
        scope: ['email', 'profile', 'https://www.googleapis.com/auth/user.phonenumbers.read']
    },
    async function(req, accessToken, refreshToken,profile, done){
        try{
            console.log(profile);
            const user = await Register.findOne({Email: profile.email});

            if(user){
                return done(null, user);
            }else{
                try{
                    const NewUser = new Register({Email: profile.email, Name: profile.displayName, Gender: profile.gender, Contact: profile.phone_number || '1234567890'});
                    const Nuser = await NewUser.save();
                    return done(null, Nuser);
                }catch(err){
                    console.log(err);
                    return done(err);
                }
            }
        }catch(err){
            console.log(err);
            return done(err);
        }
    }
    ))

}

passport.serializeUser((req,user,done) => {
    try{
        req.session.user_id = user._id;
        done(null, user._id);
    }catch(err){
        console.log(err);
        done(err);
    }
});

passport.deserializeUser((id, done) => {
    Register.findById(id).then((user) => {
        done(null, user);
    }).catch(err => {
        console.error(err);
        done(err);
    });
});

