const express = require('express');
const {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} = require('../controllers/contacts');
const { validateBody } = require('../middlewares/validateBody');
const { isValidId } = require('../middlewares/isValidId');
const { createContactSchema, updateContactSchema } = require('../validation/contactSchemas');

const router = express.Router();

router.get('/', getAllContactsController);
router.get('/:contactId', isValidId, getContactByIdController);
router.post('/', validateBody(createContactSchema), createContactController);
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), patchContactController);
router.delete('/:contactId', isValidId, deleteContactController);

module.exports = router;