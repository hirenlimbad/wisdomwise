
const mongoose = require('../connection');

const thoughtSchema = new mongoose.Schema({
    thought: {
        type: String,
        required: true
    },
    quoteid: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    likes:{
        type: Number,
        required: true,
        default: 0
    },
    time_stamp: {
        type: String,
        required: true,
        default: Date.now
    },
});

const Thought = mongoose.model('Thought', thoughtSchema);
module.exports = Thought;