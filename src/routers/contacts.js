const express = require('express');
const {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} = require('../controllers/contacts');
const { authenticate } = require('../middlewares/authenticate');
const multer = require('multer');

// 📸 Multer ayarları (geçici klasör)
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// ✅ Tüm rotalar kimlik doğrulaması gerektiriyor
router.use(authenticate);

// GET /contacts
router.get('/', getAllContactsController);

// GET /contacts/:contactId
router.get('/:contactId', getContactByIdController);

// POST /contacts — fotoğraf yükleme destekli
router.post('/', upload.single('photo'), createContactController);

// PATCH /contacts/:contactId — fotoğraf güncelleme destekli
router.patch('/:contactId', upload.single('photo'), patchContactController);

// DELETE /contacts/:contactId
router.delete('/:contactId', deleteContactController);

module.exports = router;
