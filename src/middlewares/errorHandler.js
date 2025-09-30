function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = status === 500 ? 'Something went wrong' : err.message;
  const data = err.message || 'Unexpected error';

  if (status === 204) return res.status(204).end();
  return res.status(status).json({ status, message, data });
}

module.exports = { errorHandler };