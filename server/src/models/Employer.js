const mongoose = require('mongoose');
const { EMPLOYER_VERIFICATION_STATUS } = require('../constants/statuses');

const employerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      index: true,
    },
    registrationNumber: {
      type: String,
      required: [true, 'Official business registration number is required'],
      trim: true,
      unique: true,
      index: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      index: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true, required: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
    },
    representative: {
      name: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
    },
    businessEmail: {
      type: String,
      required: [true, 'Official business email is required'],
      trim: true,
      lowercase: true,
    },
    website: {
      type: String,
      trim: true,
    },
    verificationDocuments: [
      {
        title: { type: String, required: true },
        documentType: {
          type: String,
          enum: ['TRADE_LICENSE', 'INCORPORATION_CERTIFICATE', 'RECRUITMENT_AUTHORIZATION', 'TAX_REGISTRATION'],
          required: true,
        },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false },
      },
    ],
    verificationStatus: {
      type: String,
      enum: Object.values(EMPLOYER_VERIFICATION_STATUS),
      default: EMPLOYER_VERIFICATION_STATUS.PENDING,
      index: true,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    esgRating: {
      score: { type: Number, default: 85, min: 0, max: 100 },
      tier: { type: String, enum: ['A', 'B', 'C', 'D'], default: 'A' },
      lastAudited: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
