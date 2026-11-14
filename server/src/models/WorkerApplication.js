const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../constants/statuses');

const workerApplicationSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VerifiedJob',
      required: true,
      index: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
      index: true,
    },
    applicationStatus: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
      index: true,
    },
    submittedDocuments: [
      {
        documentType: {
          type: String,
          enum: ['PASSPORT_COPY', 'TTC_CERTIFICATE', 'MEDICAL_REPORT', 'WORK_PERMIT_VISA', 'SIGNED_CONTRACT'],
          required: true,
        },
        fileUrl: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false },
      },
    ],
    interviewDetails: {
      scheduledAt: { type: Date },
      meetingLink: { type: String },
      notes: { type: String },
      status: {
        type: String,
        enum: ['NOT_SCHEDULED', 'SCHEDULED', 'COMPLETED', 'CANCELLED'],
        default: 'NOT_SCHEDULED',
      },
    },
    complianceStatus: {
      type: String,
      enum: ['PENDING_AUDIT', 'COMPLIANT', 'FLAGGED'],
      default: 'PENDING_AUDIT',
      index: true,
    },
    // Mandatory confirmation that candidate paid $0
    workerZeroFeeAffidavit: {
      confirmed: { type: Boolean, default: true, required: true },
      affidavitTimestamp: { type: Date, default: Date.now },
      signatureStatement: {
        type: String,
        default: 'I confirm that I have paid zero recruitment or placement fees for this application.',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications by same worker for same job
workerApplicationSchema.index({ workerId: 1, jobId: 1 }, { unique: true });

const WorkerApplication = mongoose.model('WorkerApplication', workerApplicationSchema);

module.exports = WorkerApplication;
