const mongoose = require('../connection');

const seenQuoteSchema = new mongoose.Schema({

    quote: {
        type: String,
        required: true
    },

    user: {
        type: String,
        required: true
    },
    seen_at: {
        type: Date,
        default: Date.now
    }

});

const seenQuote = mongoose.model('SeenQuote', seenQuoteSchema);
module.exports = seenQuote;