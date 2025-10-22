const createError = require('http-errors');
const {
  registerUser,
  loginUser,
  refreshSession,
  logoutSession,
} = require('../services/auth');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { User } = require('../db/models/user');

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

// 🔹 Şifre Sıfırlama E-Postası Gönderimi
async function sendResetEmailController(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) throw createError(400, 'Email is required');

    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>Merhaba ${user.name || 'kullanıcı'},</p>
        <p>Şifreni sıfırlamak için aşağıdaki bağlantıya tıkla:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Bu bağlantı 5 dakika içinde geçersiz olacaktır.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('Email gönderim hatası:', error);
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
