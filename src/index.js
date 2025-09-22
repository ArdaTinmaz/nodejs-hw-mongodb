require('dotenv').config();
const { initMongoConnection } = require('./db/initMongoConnection');
const { setupServer } = require('./server');

(async () => {
  try {
    await initMongoConnection();

    const app = setupServer();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();