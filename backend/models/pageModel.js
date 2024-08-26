import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const pageSchema = new mongoose.Schema({
  pageName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    required: true
  },
  platform: {
    type: String,
    enum: ['TJ', 'TR', 'TG', 'IJ', 'BJ', 'TG'],
    required: true
  },
  pageURL: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
});


const Page = mongoose.model('Page', pageSchema);

export default Page;
