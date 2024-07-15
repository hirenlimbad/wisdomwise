const mongoose = require('../connection');

// Define the User schema
const userSchema = new mongoose.Schema({
    uname: {
        type: String,
        required: true
    },
    uemail: {
        type: String,
        required: false,
        unique: false,
    },
    upassword: {
        type: String,
        required: true
    },
    tagline: {
        type: String,
        required: false,
        default: "None"
    },
    tagInterest: {
        type: Array,
        required: false,
        default: [ ['trending_init@', 5], ['inspirational', 1], ['finance' , 2], ['creativity', 1], ['focus', '1'], ['motivation', 1] ]
    },
    authorInterest: {
        type: Array,
        required: false,
        default: "None"
    },
    updatedIntestTime: {
        type: Array,
        required: false,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    useridpub:{
        type: String,
        required: false,
        unique: true
    },
    loginAllowed: {
        type: String, 
        required: false,
        default: true,
    },
    about: {
        type: String,
        required: false,
        default: "None"
    },
    profileImage: {
        type: String,
        required: false,
        default: "data:image/jpeg;base64,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"
    },
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
