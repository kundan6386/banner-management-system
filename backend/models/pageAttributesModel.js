import mongoose from 'mongoose';

const pageAttributesSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true
  },
  page_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page', 
    required: true
  },
  page_placement: {
    type: String,
    required: true
  },
  placement_width: {
    type: String,
    required: true
  },
  placement_height: {
    type: String,
    required: true
  },
  mobile_placement_width: {
    type: String,
    required: true
  },
  mobile_placement_height: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    required: true
  },
}, {
  timestamps: true,
});

const PageAttributes = mongoose.model('PageAttributes', pageAttributesSchema);

export default PageAttributes;
