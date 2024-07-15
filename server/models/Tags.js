const mongoose = require('../connection');

const tagsSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true
    },
    sentiment: {
        type: String,
        default: 'Neutral',
        required: false
    },
    count: {
        type: Number,
        default: 0,
        required: false
    }
});

const Tags = mongoose.model('Tags', tagsSchema);
module.exports = Tags;  // Ensure correct export
