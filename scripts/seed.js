require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { initMongoConnection } = require('../src/db/initMongoConnection');
const { Contact } = require('../src/db/models/contact');

(async () => {
  try {
    await initMongoConnection();

    const dataPath = path.join(process.cwd(), 'contacts.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const contacts = JSON.parse(raw);

    await Contact.deleteMany({});
    await Contact.insertMany(contacts);

    console.log('Seed completed OK');
    process.exit(0);
  } catch (e) {
    console.error('Seed error:', e);
    process.exit(1);
  }
})();