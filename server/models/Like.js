const mongoose = require('../connection');

// Define the Like schema
const likeSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    liked_at: {
        type: Date,
        default: Date.now
    }
});

// Create the Like model
const Like = mongoose.model('Like', likeSchema);
module.exports = Like;