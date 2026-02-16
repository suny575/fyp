const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'staff', 'technician'],
    default: 'staff'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invitation', invitationSchema);
