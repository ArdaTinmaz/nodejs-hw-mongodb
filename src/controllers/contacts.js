const { getAllContactsService, getContactByIdService } = require('../services/contacts');

async function getAllContactsController(_req, res, next) {
  try {
    const contacts = await getAllContactsService();
    return res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
}

async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await getContactByIdService(contactId);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    return res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    
    return res.status(404).json({ message: 'Contact not found' });
  }
}

module.exports = { getAllContactsController, getContactByIdController };