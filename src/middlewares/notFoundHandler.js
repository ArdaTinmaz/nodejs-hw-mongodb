const createError = require('http-errors');

function notFoundHandler(_req, _res, next) {
  next(createError(404, 'Route not found'));
}

module.exports = { notFoundHandler };