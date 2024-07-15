const mongoose = require('../connection');

const quoteSchema = new mongoose.Schema({
  quote: {
    type: String,
    required: true
  },
  author_name: {
    type: String,
    required: true
  },
  tag: {
    type: Array,
    required: false
  },
  time_stamp: {
    type: String,
    required: true,
    default: Date.now
  },
  like_count: {
    type: Number,
    required: true,
    default: 0
  },
  share_count: {
    type: Number,
    required: true,
    default: 0
  },
  bookmark_count: {
    type: Number,
    required: true,
    default: 0
  },
  copy_count: {
    type: Number,
    required: true,
    default: 0
  },
  comment_count: {
    type: Number,
    required: true,
    default: 0
  },
  weight : {
    type: Number,
    required: false,
    default: 0
  },
  u_id: {
    type: String,
    required: true
  }
});

const Quote = mongoose.model('Quote', quoteSchema);
module.exports = Quote;
