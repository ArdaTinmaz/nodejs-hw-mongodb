const { Router } = require('express');
const { ctrlWrapper } = require('../utils/ctrlWrapper');

const {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} = require('../controllers/contacts');

const router = Router();

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController));
router.patch('/:contactId', ctrlWrapper(patchContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));

module.exports = router;