const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { User } = require('../db/models/user');
const { Session } = require('../db/models/session');

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'accesssecret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refreshsecret';

// 🔹 KULLANICI KAYIT
async function registerUser({ name, email, password }) {
  // Aynı email var mı?
  const existing = await User.findOne({ email });
  if (existing) throw createError(409, 'Email in use');

  // Şifre hashlenir
  const hashedPassword = await bcrypt.hash(password, 10);

  // Yeni kullanıcı oluşturulur
  const user = await User.create({ name, email, password: hashedPassword });
  const userObj = user.toObject();
  delete userObj.password; // şifre dışarıya gönderilmez
  return userObj;
}

// 🔹 GİRİŞ (Login)
async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Email or password invalid');

  // Şifre doğru mu?
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw createError(401, 'Email or password invalid');

  // Eski oturumları sil
  await Session.deleteMany({ userId: user._id });

  // Yeni token’lar oluştur
  const accessToken = jwt.sign({ userId: user._id }, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user._id }, REFRESH_SECRET, { expiresIn: '30d' });

  // Oturum kaydı oluştur
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}

// 🔹 OTURUM YENİLEME
async function refreshSession(refreshToken) {
  if (!refreshToken) throw createError(401, 'Refresh token missing');

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createError(401, 'Session not found');

  // Eski session silinir
  await Session.deleteOne({ _id: session._id });

  // Yeni token’lar oluşturulur
  const accessToken = jwt.sign({ userId: session.userId }, ACCESS_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign({ userId: session.userId }, REFRESH_SECRET, { expiresIn: '30d' });

  // Yeni session kaydedilir
  await Session.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken: newRefreshToken };
}

// 🔹 ÇIKIŞ (Logout)
async function logoutSession(refreshToken) {
  if (!refreshToken) return;
  await Session.deleteOne({ refreshToken });
}

module.exports = {
  registerUser,
  loginUser,
  refreshSession,
  logoutSession,
};
