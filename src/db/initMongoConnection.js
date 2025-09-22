const mongoose = require('mongoose');

async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

  const uri = `mongodb+srv://${encodeURIComponent(MONGODB_USER)}:${encodeURIComponent(
    MONGODB_PASSWORD,
  )}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  await mongoose.connect(uri);
  console.log('Mongo connection successfully established!');
}

module.exports = { initMongoConnection };