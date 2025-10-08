const createError = require('http-errors');

const validateBody = schema => (req, _res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(createError(400, error.message));
  }
  next();
};

module.exports = { validateBody };