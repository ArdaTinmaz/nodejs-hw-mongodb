const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const { getAllContactsController, getContactByIdController } = require('./controllers/contacts');

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pinoHttp());

  // Routes
  app.get('/contacts', getAllContactsController);
  app.get('/contacts/:contactId', getContactByIdController);

  // 404 - tanımsız rotalar
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}

module.exports = { setupServer };