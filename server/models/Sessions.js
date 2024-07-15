const mongoose = require('../connection');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Session = mongoose.model('Session', sessionSchema);


module.exports = Session;