const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/quote_plateform';
mongoose.connect(mongoURI);



const QuoteModel = require('..//models//Quote.js');

// // checking connection
mongoose.connection.on('connected', async () => {
    // for all quotes adding the weight = 0 if not
    const quotes = await QuoteModel.find();
    quotes.forEach(async (quote) => {
        if (!quote.comment_count) {
            quote.comment_count = 0;
            await quote.save();
        }
    });
    console.log('All quotes have been updated');
});
