const { Contact } = require('../db/models/contact');


async function getAllContactsService({ filter = {}, skip = 0, limit = 10, sort = {} }) {
  const [contacts, totalItems] = await Promise.all([
    Contact.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter),
  ]);

  return [contacts, totalItems];
}


async function getContactByIdService(contactId, userId) {
  return Contact.findOne({ _id: contactId, userId }).lean();
}


async function createContactService(payload) {
  return Contact.create(payload);
}


async function patchContactService(contactId, payload, userId) {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, payload, { new: true, lean: true });
}


async function deleteContactService(contactId, userId) {
  return Contact.findOneAndDelete({ _id: contactId, userId }).lean();
}

module.exports = {
  getAllContactsService,
  getContactByIdService,
  createContactService,
  patchContactService,
  deleteContactService,
};
