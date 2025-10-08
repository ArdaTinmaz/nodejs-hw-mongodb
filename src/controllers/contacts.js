const createError = require('http-errors');
const {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  patchContactService,
  deleteContactService,
} = require('../services/contacts');

// ✅ GET /contacts (with pagination, sorting, filtering)
async function getAllContactsController(req, res) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    isFavourite,
    type,
  } = req.query;

  // filtreleme koşulu
  const filter = {};
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';
  if (type) filter.contactType = type;

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  // servis katmanında find/findAll logic varsa parametreleri oraya gönder
  const [contacts, totalItems] = await getAllContactsService({
    filter,
    skip,
    limit: Number(perPage),
    sort,
  });

  const totalPages = Math.ceil(totalItems / perPage);

  return res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
}

// ✅ GET /contacts/:contactId
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

// ✅ POST /contacts
async function createContactController(req, res) {
  const created = await createContactService(req.body);
  return res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: created,
  });
}

// ✅ PATCH /contacts/:contactId
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

// ✅ DELETE /contacts/:contactId
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