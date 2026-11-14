const mongoose = require('mongoose');

const complianceFlagSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    targetType: {
      type: String,
      enum: ['EMPLOYER', 'JOB', 'APPLICATION', 'BROKER_ATTEMPT'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    flagReason: {
      type: String,
      enum: [
        'DEMANDED_RECRUITMENT_FEE',
        'CONTRACT_SUBSTITUTION',
        'PASSPORT_CONFISCATION_THREAT',
        'MISLEADING_SALARY',
        'UNSAFE_CONDITIONS',
        'OTHER_VIOLATION',
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'HIGH',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    evidenceFiles: [String],
    status: {
      type: String,
      enum: ['OPEN', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'OPEN',
      index: true,
    },
    resolutionNotes: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

const ComplianceFlag = mongoose.model('ComplianceFlag', complianceFlagSchema);

module.exports = ComplianceFlag;
