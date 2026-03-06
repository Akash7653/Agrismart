import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String },
    country: { type: String },
    language: { type: String, default: 'en' }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

