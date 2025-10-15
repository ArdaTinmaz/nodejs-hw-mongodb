const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { Session } = require('../db/models/session');

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'accesssecret';

const authenticate = async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(createError(401, 'Not authorized'));
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    const session = await Session.findOne({ accessToken: token });

    if (!session) throw createError(401, 'Session not found');
    if (new Date() > session.accessTokenValidUntil) throw createError(401, 'Access token expired');

    req.user = { _id: payload.userId };
    next();
  } catch (error) {
    next(createError(401, error.message));
  }
};

module.exports = { authenticate };
