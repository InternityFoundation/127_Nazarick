var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    // _id: {
    //     type: Number,
    //     required: true
    // },
    name: {
        type: String,
    },
    age: {
        type: Number
    },
    identification: {
        type: String
    },
    image: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    addedby: {
        type: Number,
        ref: 'user',
        required: true
    },
    flag:{
        type:String,
        required: true
    }
    
});

const Post = mongoose.model('child', postSchema)
module.exports = Post;
