// importing mongoose
const mongoose = require('mongoose');
const mongoURI = 'mongodb://127.0.0.1:27017/quote_plateform';

// Using mongoose.connect to create a single connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Importing the model correctly
const LikeModel = require('../models/Like.js');

// Ensure the connection is successful before using the model
mongoose.connection.on('connected', () => {
    LikeModel.find({}).then((likes) => {
        console.log(likes);
    }).catch((err) => {
        console.log(err);
    });
});

// Error handling for the connection
mongoose.connection.on('error', (err) => {
    console.log('Connection error:', err);
});
