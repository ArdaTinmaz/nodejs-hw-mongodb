const { Schema, model } = require('mongoose');

const contactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, default: null, trim: true },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, versionKey: false },
);

const Contact = model('Contact', contactSchema); 
module.exports = { Contact };