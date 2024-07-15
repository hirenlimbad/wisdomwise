
const mongoose = require('../connection');

// Define the Bookmark schema
const bookmarkSchema = new mongoose.Schema({
    quote: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    bookmarked_at: {
        type: Date,
        default: Date.now
    }
});

// Create the Bookmark model
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);
module.exports = Bookmark;