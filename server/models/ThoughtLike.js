const mongoose = require('../connection');

// Define the Like schema
const thoughtSchema = new mongoose.Schema({
    thought: {
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
const ThoughtLike = mongoose.model('ThoughtLike', thoughtSchema);
module.exports = ThoughtLike;