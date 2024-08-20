const mongoose = require("mongoose");

const RequestSchemaTrain = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, required: true },
    // time: { type: String, required: true },
    email: { type: String, required:true},
    contact_num: {type: Number, required: true},
    Trainnumber: {type: Number, required: true},
    class: {type: String, required: true}
});

const RequestsTrain= new mongoose.model("RequestsTrain",RequestSchemaTrain);


const RequestSchemaCab = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    vacantspace: {type: Number, required: true},
    genderSpecification: { type: String, required: true },
    email: { type: String, required:true},
    contact_num: {type: Number, required: true},
    fareShare: {type: Number, required: true}
})

const RequestsCab = new mongoose.model("RequestsCab", RequestSchemaCab);


const RequestSchemaFlight = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: Date, required: true },
    // time: { type: String, required: true },
    email: { type: String, required:true},
    contact_num: {type: Number, required: true},
    Flightnumber: {type: String, required: true},
    class: {type: String, required: true}
})

const RequestsFlight = new mongoose.model("RequestsFlight", RequestSchemaFlight);


module.exports={RequestsCab, RequestsFlight, RequestsTrain};
