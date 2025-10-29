const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');

const contactsRouter = require('./routers/contacts');
const authRouter = require('./routers/auth');
const docsRouter = require('./routers/docs'); 
const { errorHandler } = require('./middlewares/errorHandler');
const { notFoundHandler } = require('./middlewares/notFoundHandler');

function setupServer() {
  const app = express();

  // 🌐 Middleware’ler
  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json());

  // 📘 Rotalar
  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  // ✅ Swagger dokümantasyonu rotası
  app.use('/api-docs', docsRouter);

  // Basit health/info endpoint
  app.get('/', (_req, res) =>
    res.json({ ok: true, routes: ['/auth', '/contacts', '/api-docs'] })
  );

  // ⚠️ 404 ve hata yakalayıcılar
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { setupServer };
