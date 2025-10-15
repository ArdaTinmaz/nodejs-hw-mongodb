const createError = require('http-errors');
const {
  registerUser,
  loginUser,
  refreshSession,
  logoutSession,
} = require('../services/auth');

const cookieName = process.env.COOKIE_NAME || 'refreshToken';

const cookieOpts = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

// 🔹 Kullanıcı Kaydı
async function registerController(req, res, next) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// 🔹 Giriş Yapma
async function loginController(req, res, next) {
  try {
    const result = await loginUser(req.body);

    // Refresh token cookie'ye kaydedilir
    res.cookie(cookieName, result.refreshToken, {
      ...cookieOpts,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    });

    // Access token response body'de döner
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken: result.accessToken },
    });
  } catch (error) {
    next(error);
  }
}

// 🔹 Refresh (Oturum Yenileme)
async function refreshController(req, res, next) {
  try {
    const result = await refreshSession(req.cookies[cookieName]);

    res.cookie(cookieName, result.refreshToken, {
      ...cookieOpts,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: result.accessToken },
    });
  } catch (error) {
    next(error);
  }
}

// 🔹 Logout (Çıkış)
async function logoutController(req, res, next) {
  try {
    await logoutSession(req.cookies[cookieName]);
    res.clearCookie(cookieName, cookieOpts);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
};
