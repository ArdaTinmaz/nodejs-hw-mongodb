const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const contactsRouter = require('./routers/contacts');
const { errorHandler } = require('./middlewares/errorHandler');
const { notFoundHandler } = require('./middlewares/notFoundHandler');

function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json());

  // (Opsiyonel) Basit health/info
  app.get('/', (_req, res) => res.json({ ok: true, routes: ['/contacts', '/contacts/:contactId'] }));

  app.use('/contacts', contactsRouter);

  // 404 ve hata yakalayıcılar
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { setupServer };