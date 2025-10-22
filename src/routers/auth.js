const express = require('express');
const {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController, // 👈 eklendi
} = require('../controllers/auth');

const router = express.Router();

// Kullanıcı kayıt
router.post('/register', registerController);

// Giriş yapma
router.post('/login', loginController);

// Oturum yenileme
router.post('/refresh', refreshController);

// Çıkış yapma
router.post('/logout', logoutController);

// ✅ Şifre sıfırlama e-postası gönderimi
router.post('/send-reset-email', sendResetEmailController);

module.exports = router; // 👈 doğru export
