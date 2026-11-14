const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    education: [
      {
        institution: { type: String, trim: true },
        degree: { type: String, trim: true },
        fieldOfStudy: { type: String, trim: true },
        yearCompleted: { type: Number },
      },
    ],
    experience: [
      {
        company: { type: String, trim: true },
        role: { type: String, trim: true },
        durationYears: { type: Number },
        description: { type: String, trim: true },
      },
    ],
    certifications: [
      {
        name: { type: String, trim: true },
        issuingOrganization: { type: String, trim: true },
        issueDate: { type: Date },
        credentialUrl: { type: String, trim: true },
      },
    ],
    languageSkills: [
      {
        language: { type: String, trim: true },
        proficiencyLevel: {
          type: String,
          enum: ['BASIC', 'INTERMEDIATE', 'FLUENT', 'NATIVE'],
          default: 'BASIC',
        },
      },
    ],
    TTCVerification: {
      isVerified: { type: Boolean, default: false },
      certificateNumber: { type: String, trim: true },
      verifiedAt: { type: Date },
      centerName: { type: String, trim: true }, // e.g. Bangladesh Technical Training Center (BMET)
    },
    identityVerificationStatus: {
      type: String,
      enum: ['UNVERIFIED', 'SUBMITTED', 'VERIFIED', 'REJECTED'],
      default: 'UNVERIFIED',
      index: true,
    },
    profileVisibility: {
      type: String,
      enum: ['PUBLIC', 'EMPLOYERS_ONLY', 'PRIVATE'],
      default: 'EMPLOYERS_ONLY',
    },
    // Zero-fee acknowledgement declaration
    zeroFeeDeclarationSigned: {
      type: Boolean,
      default: true,
    },
    declarationSignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Redact sensitive identity details when converting to JSON for employer views
workerSchema.methods.toEmployerSafeJSON = function () {
  const obj = this.toObject();
  // Ensure no government identity documents or sensitive private info is exposed
  delete obj.TTCVerification?.certificateNumber;
  return obj;
};

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
