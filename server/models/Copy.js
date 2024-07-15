const mongoose = require('../connection');

// Define the Copy schema
const copySchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    copied_at: {
        type: Date,
        default: Date.now
    }
});

// Create the Copy model
const Copy = mongoose.model('Copy', copySchema);
module.exports = Copy;