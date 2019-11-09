const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    // _id: {
    //     type: Number,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    // image: {
    //     type: String,
    // },
    lastlocation: {
        type: Object 
    },
    deviceid: {
        type: String
    },
    authorisation: {
        type: Number
    }
    
})

const User = mongoose.model("user1", userSchema);
module.exports = User