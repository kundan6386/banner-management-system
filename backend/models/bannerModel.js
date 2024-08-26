// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the schema for the Banner model
const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    min: 1,
    max: 10,
    default: null // Set default value to null
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null // Set default value to null
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive',
    required: true
  },
  platform: {
    type: String,
    enum: ['TJ', 'TR', 'TG', 'IJ', 'BJ', 'TG'],
    required: true
  },
  lang: {
    type: String,
    enum: ['all','en', 'hi', 'mr', 'ta', 'te'],
    default: 'all',
  },
  desktopImage: {
    type: String,
    required: true
  },
  mobileImage: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  bannerClass: {
    type: String,
    required: true
  },
  page: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null
  },
  placement: {
    type: String,
    default: null // Set default value to null
  }
},{
  timestamps: true,
});


const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
