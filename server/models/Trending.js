
const mongoose = require('../connection');

const trendingSchema = new mongoose.Schema({
    quote_id: {
        type: Array,
        required: true
    },
    weight: {
        type: Array,
        required: true
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
   },
    {
        timestamps: true
    }
);

const Trending = mongoose.model('Trending', trendingSchema);
module.exports = Trending;
