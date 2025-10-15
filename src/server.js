const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const contactsRouter = require('./routers/contacts');
const authRouter = require('./routers/auth');
const { errorHandler } = require('./middlewares/errorHandler');
const { notFoundHandler } = require('./middlewares/notFoundHandler');

function setupServer() {
  const app = express(); 

  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json());

  
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // Basit health/info endpoint
  app.get('/', (_req, res) => res.json({ ok: true, routes: ['/auth', '/contacts'] }));

  // 404 ve hata yakalayıcılar
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { setupServer };
