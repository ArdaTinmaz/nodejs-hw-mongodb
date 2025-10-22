const { Schema, model } = require('mongoose');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?\d{7,15}$/, 'Invalid phone number format'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['home', 'work', 'personal'],
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    // 🔹 Cloudinary fotoğraf URL’si burada tutulacak
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenir
    versionKey: false,
  }
);

const Contact = model('Contact', contactSchema);

module.exports = { Contact };
