const mongoose = require('mongoose');
const { JOB_STATUS } = require('../constants/statuses');

const verifiedJobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Destination country is required'],
      trim: true,
      index: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Industry sector is required'],
      trim: true,
      index: true,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    vacancies: {
      type: Number,
      default: 1,
      min: [1, 'Must have at least 1 vacancy'],
    },
    salary: {
      base: { type: Number, required: true },
      min: { type: Number },
      max: { type: Number },
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    overtimePolicy: {
      type: String,
      required: [true, 'Overtime compensation policy must be transparently declared'],
      trim: true,
    },
    housingTerms: {
      type: String,
      required: [true, 'Housing/accommodation terms must be declared'],
      trim: true,
    },
    medicalTerms: {
      type: String,
      required: [true, 'Medical and health insurance coverage terms must be declared'],
      trim: true,
    },
    workingHours: {
      type: Number,
      required: [true, 'Standard working hours per week is required'],
      default: 48,
    },
    weeklyHolidays: {
      type: Number,
      required: [true, 'Weekly rest days is required'],
      default: 1,
    },
    contractDuration: {
      type: String,
      required: [true, 'Contract duration must be specified (e.g. 2 Years)'],
      trim: true,
    },
    visaRequirements: {
      type: String,
      required: [true, 'Visa and sponsorship details are required'],
      trim: true,
    },
    contractDocument: {
      fileUrl: { type: String },
      version: { type: String, default: '1.0' },
      verifiedByCompliance: { type: Boolean, default: false },
    },
    zeroWorkerFeeGuarantee: {
      type: Boolean,
      default: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PUBLISHED,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
verifiedJobSchema.index({
  title: 'text',
  description: 'text',
  industry: 'text',
  country: 'text',
  city: 'text',
});

const VerifiedJob = mongoose.model('VerifiedJob', verifiedJobSchema);

module.exports = VerifiedJob;
