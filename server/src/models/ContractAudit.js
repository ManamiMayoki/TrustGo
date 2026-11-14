const mongoose = require('mongoose');
const { COMPLIANCE_STATUS } = require('../constants/statuses');

const contractAuditSchema = new mongoose.Schema(
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
    contractVersion: {
      type: String,
      default: '1.0',
    },
    contractDocumentUrl: {
      type: String,
    },
    workerFeeDeclaration: {
      isZeroFeeCompliant: { type: Boolean, default: true, required: true },
      signedDeclarationUrl: String,
      verifiedAt: Date,
      auditorNotes: String,
    },
    salaryTransparency: {
      meetsStatutoryMinimum: { type: Boolean, default: true },
      statedMonthlyBase: { type: Number, required: true },
      currency: { type: String, default: 'USD' },
      timelyPaymentGuaranteed: { type: Boolean, default: true },
    },
    legalComplianceChecks: [
      {
        checkName: { type: String, required: true }, // e.g. "Zero Worker Placement Fee", "No Passport Withholding"
        category: { type: String, enum: ['FEES', 'CONTRACT_TERMS', 'WELFARE', 'LEGAL_STATUS', 'HUMAN_RIGHTS'], required: true },
        passed: { type: Boolean, default: false },
        standardReference: String, // e.g. "ILO General Principles No. 188", "EU CSDDD Art 7"
        notes: String,
      },
    ],
    auditFindings: [
      {
        type: String,
      },
    ],
    complianceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    complianceStatus: {
      type: String,
      enum: Object.values(COMPLIANCE_STATUS),
      default: COMPLIANCE_STATUS.VERIFIED_COMPLIANT,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportReferenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    frameworkStandard: {
      type: String,
      enum: ['ILO_CONVENTION_181', 'EU_CSDDD_DIRECTIVE', 'BMET_BANGLADESH_STANDARD', 'GCC_LABOR_CODE'],
      default: 'ILO_CONVENTION_181',
    },
  },
  {
    timestamps: true,
  }
);

const ContractAudit = mongoose.model('ContractAudit', contractAuditSchema);

module.exports = ContractAudit;
