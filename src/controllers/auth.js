const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const SibApiV3Sdk = require('@getbrevo/brevo');
const { User } = require('../db/models/user');
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

/* ==========================================================
   🔹 1. Kullanıcı Kaydı
========================================================== */
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

/* ==========================================================
   🔹 2. Giriş Yapma
========================================================== */
async function loginController(req, res, next) {
  try {
    const result = await loginUser(req.body);

    res.cookie(cookieName, result.refreshToken, {
      ...cookieOpts,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken: result.accessToken },
    });
  } catch (error) {
    next(error);
  }
}

/* ==========================================================
   🔹 3. Refresh (Oturum Yenileme)
========================================================== */
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

/* ==========================================================
   🔹 4. Logout (Çıkış)
========================================================== */
async function logoutController(req, res, next) {
  try {
    await logoutSession(req.cookies[cookieName]);
    res.clearCookie(cookieName, cookieOpts);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

/* ==========================================================
   🔹 5. Şifre Sıfırlama E-Postası (Brevo API ile)
========================================================== */
async function sendResetEmailController(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) throw createError(400, 'Email is required');

    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');

    // Token oluştur (5 dakika geçerli)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    // Brevo API ayarları
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = {
      sender: { email: process.env.SMTP_FROM, name: 'GOIT App' },
      to: [{ email }],
      subject: 'Password Reset Request',
      htmlContent: `
        <p>Merhaba ${user.name || 'kullanıcı'},</p>
        <p>Şifreni sıfırlamak için aşağıdaki bağlantıya tıkla (5 dakika geçerli):</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    };

    // Mail gönderimi
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('Brevo mail hatası:', error);
    next(createError(500, 'Failed to send the email, please try again later.'));
  }
}

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
};
