const mongoose = require('mongoose');
const {
  ESCROW_MILESTONES,
  MILESTONE_STATUS,
  ESCROW_RELEASE_STATUS,
} = require('../constants/statuses');

const milestoneItemSchema = new mongoose.Schema(
  {
    milestoneType: {
      type: String,
      enum: Object.values(ESCROW_MILESTONES),
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    allocatedAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(MILESTONE_STATUS),
      default: MILESTONE_STATUS.LOCKED,
    },
    evidenceDocuments: [
      {
        documentType: String,
        fileUrl: String,
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    // For Milestone 3: Day-30 Bengali Voice Check-In
    welfareCheckInData: {
      voiceNoteUrl: String,
      bengaliTranscript: String,
      englishTranslation: String,
      welfareScore: { type: Number, min: 1, max: 10 },
      workerReportedCondition: {
        passportInPossession: { type: Boolean, default: true },
        salaryPaidAsContracted: { type: Boolean, default: true },
        safeAccommodations: { type: Boolean, default: true },
      },
      verifiedAt: Date,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    releaseTransactionHash: String,
    notes: String,
  },
  { _id: true }
);

const escrowMilestoneSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkerApplication',
      required: true,
      unique: true,
      index: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employer',
      required: true,
      index: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
      index: true,
    },
    totalContractualAmount: {
      type: Number,
      required: [true, 'Total contractual escrow amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    milestones: [milestoneItemSchema],
    releaseStatus: {
      type: String,
      enum: Object.values(ESCROW_RELEASE_STATUS),
      default: ESCROW_RELEASE_STATUS.HELD_IN_ESCROW,
      index: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    transactionReference: {
      type: String,
      required: true,
      unique: true,
    },
    auditHistory: [
      {
        action: { type: String, required: true },
        actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        previousState: String,
        newState: String,
        timestamp: { type: Date, default: Date.now },
        reason: String,
      },
    ],
    isSimulatedLedger: {
      type: Boolean,
      default: true, // Clearly marks simulated accounting until external bank API integration
    },
  },
  {
    timestamps: true,
  }
);

const EscrowMilestone = mongoose.model('EscrowMilestone', escrowMilestoneSchema);

module.exports = EscrowMilestone;
