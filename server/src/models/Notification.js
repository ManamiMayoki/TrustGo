const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['SYSTEM', 'VERIFICATION', 'JOB_APPLICATION', 'ESCROW_MILESTONE', 'COMPLIANCE_ALERT', 'WELFARE_CHECK'],
      default: 'SYSTEM',
    },
    actionUrl: String,
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
