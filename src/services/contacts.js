const { Contact } = require('../db/models/contact');

// ✅ GET ALL (with pagination, sorting, filtering)
async function getAllContactsService({ filter = {}, skip = 0, limit = 10, sort = {} }) {
  // Promise.all: aynı anda hem listeyi hem toplam sayıyı çeker
  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ]);

  return [contacts, totalItems];
}

// Diğer servis fonksiyonların aynı kalıyor 👇

async function getContactByIdService(contactId) {
  return Contact.findById(contactId).lean();
}

async function createContactService(payload) {
  return Contact.create(payload);
}

async function patchContactService(contactId, payload) {
  return Contact.findByIdAndUpdate(contactId, payload, { new: true, lean: true });
}

async function deleteContactService(contactId) {
  return Contact.findByIdAndDelete(contactId).lean();
}

module.exports = {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  patchContactService,
  deleteContactService,
};