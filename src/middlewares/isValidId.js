const { isValidObjectId } = require('mongoose');
const createError = require('http-errors');

const isValidId = (req, _res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(createError(400, `${contactId} is not a valid id`));
  }
  next();
};

module.exports = { isValidId };