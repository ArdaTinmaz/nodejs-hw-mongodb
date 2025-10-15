const express = require('express');
const {
  registerController,
  loginController,
  refreshController,
  logoutController,
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

module.exports = router;
