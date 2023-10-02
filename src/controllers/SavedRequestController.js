const Request = require("../models/requests");
const Register= require("../models/register");
const SavedRequest = require("../models/SavedRequests");

const SaveTrain = async (req,res) => {
    try{
        const {id} = req.params;
        const isExist = await SavedRequest.findOne({$and: [{userId: req.session.user_id}, {requestId: id} ]});
        if(isExist){
            res.status(204).send();
        }
        else{
            const NewLiked = new SavedRequest({
                userId: req.session.user_id,
                requestId: id,
                mode: "train"
            });
            const Nliked = await NewLiked.save();

            res.status(204).send();
        }
    }catch(err){
        console.log(err);
        res.render("/login", {errorMessage: "Internal Server Error"});
    }
}


const SaveFlight = async (req,res) => {
    try{
        const {id} = req.params;
        const isExist = await SavedRequest.findOne({$and: [{userId: req.session.user_id}, {requestId: id} ]});
        if(isExist){
            res.status(204).send();
        }
        else{
            const NewLiked = new SavedRequest({
                userId: req.session.user_id,
                requestId: id,
                mode: "flight"
            });
            const Nliked = await NewLiked.save();

            res.status(204).send();
        }
    }catch(err){
        console.log(err);
        res.render("/login", {errorMessage: "Internal Server Error"});
    }
}

const SaveCab = async (req,res) => {
    try{
        const {id} = req.params;
        const isExist = await SavedRequest.findOne({$and: [{userId: req.session.user_id}, {requestId: id} ]});
        if(isExist){
            res.status(204).send();
        }
        else{
            const NewLiked = new SavedRequest({
                userId: req.session.user_id,
                requestId: id,
                mode: "cab"
            });
            const Nliked = await NewLiked.save();

            res.status(204).send();
        }
    }catch(err){
        console.log(err);
        res.render("/login", {errorMessage: "Internal Server Error"});
    }
}

const UnSave = async (req,res) => {
    try{
        const {id} = req.params;
        const isExist = await SavedRequest.findOne({$and: [{userId: req.session.user_id}, {requestId: id} ]});
        if(!isExist){
            res.status(204).send();
        }
        else{
            const deleted = await SavedRequest.deleteOne({$and: [{userId: req.session.user_id}, {requestId: id} ]});
            res.status(204).send();
        }
    }catch(err){
        console.log(err);
        res.render("/login", {errorMessage: "Internal Server Error"});
    }
}

const UnsaveLiked = async (req,res)=> {
    try{
        const {id} = req.params;
        const deleted = await SavedRequest.deleteOne({$and: [{userId: req.session.user_id}, {requestId: id} ]});
        res.redirect("/LikedRequest");
    }catch(err){
        console.log(err);
        res.render("/login", {errorMessage: "Internal Server Error"});
    }
}

module.exports={
    SaveTrain,
    SaveCab,
    SaveFlight,
    UnSave,
    UnsaveLiked
}