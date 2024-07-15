
const mongoose = require('../connection');

// Define the Share schema
const shareSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    shared_at: {
        type: Date,
        default: Date.now
    }
});


// Create the Share model
const Share = mongoose.model('Share', shareSchema);
module.exports = Share;