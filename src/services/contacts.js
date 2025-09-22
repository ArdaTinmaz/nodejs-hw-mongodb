const { Contact } = require('../db/models/contact');

async function getAllContactsService() {
  return Contact.find().lean();
}

async function getContactByIdService(contactId) {
  return Contact.findById(contactId).lean();
}

module.exports = { getAllContactsService, getContactByIdService };