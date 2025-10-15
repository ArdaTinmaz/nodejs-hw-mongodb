const createError = require('http-errors');
const {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  patchContactService,
  deleteContactService,
} = require('../services/contacts');

// ✅ GET /contacts (pagination + sorting + filtering + user scope)
async function getAllContactsController(req, res) {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    isFavourite,
    type,
  } = req.query;

  // 👇 sadece giriş yapan kullanıcının verilerini al
  const filter = { userId: req.user._id };

  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';
  if (type) filter.contactType = type;

  const skip = (page - 1) * perPage;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

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

  // 👇 sadece kendi contact’larını çek
  const contact = await getContactByIdService(contactId, req.user._id);

  if (!contact) throw createError(404, 'Contact not found');
  return res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

// ✅ POST /contacts
async function createContactController(req, res) {
  // 👇 contact oluşturulurken userId otomatik eklenecek
  const created = await createContactService({
    ...req.body,
    userId: req.user._id,
  });

  return res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: created,
  });
}

// ✅ PATCH /contacts/:contactId
async function patchContactController(req, res) {
  const { contactId } = req.params;

  // 👇 sadece kendi contact’ını güncelleyebilir
  const updated = await patchContactService(contactId, req.body || {}, req.user._id);

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

  // 👇 sadece kendi contact’ını silebilir
  const deleted = await deleteContactService(contactId, req.user._id);

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
