const Session = require('./models/Sessions');
const UserModel = require('./models/User');

async function setUser(sessionId, user) {
  try {
    // checking if the user exists then update the session id
    const userExists = await Session.findOne({ userId: user });
    if (userExists) {
      userExists.sessionId = sessionId;
      await userExists.save();
      return;
    }

    const session = new Session({ sessionId, userId: user });
    await session.save();
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

async function getUser(sessionId) {
  try {
    const session = await Session.findOne({ sessionId });
    // returning the user id
    if (session) {
        return {'_id' : session.userId.toString()};
    }
    return null;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
