const createError = require('http-errors');
const {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  patchContactService,
  deleteContactService,
} = require('../services/contacts');

// GET /contacts
async function getAllContactsController(_req, res) {
  const contacts = await getAllContactsService();
  return res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

// GET /contacts/:contactId
async function getContactByIdController(req, res) {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId);
  if (!contact) throw createError(404, 'Contact not found');
  return res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

// POST /contacts
async function createContactController(req, res) {
  const { name, phoneNumber, contactType } = req.body || {};
  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'name, phoneNumber and contactType are required');
  }
  const created = await createContactService(req.body);
  return res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: created,
  });
}

// PATCH /contacts/:contactId
async function patchContactController(req, res) {
  const { contactId } = req.params;
  const updated = await patchContactService(contactId, req.body || {});
  if (!updated) throw createError(404, 'Contact not found');
  return res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
}

// DELETE /contacts/:contactId
async function deleteContactController(req, res) {
  const { contactId } = req.params;
  const deleted = await deleteContactService(contactId);
  if (!deleted) throw createError(404, 'Contact not found');
  return res.status(204).end();
}

module.exports = {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  patchContactController,
  deleteContactController,
};