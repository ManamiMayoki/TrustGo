# TrustGo Database Schema & Entity Relationships

TrustGo utilizes MongoDB with Mongoose ODM. Schemas enforce strict types, validators, default values, references, compound indexes, and timestamps.

```
       +------------------+             +----------------------+
       |      User        |<------------|   EmployerProfile    |
       |------------------| 1         1 |----------------------|
       | _id              |             | _id                  |
       | email            |             | userId (Ref: User)   |
       | passwordHash     |             | companyName          |
       | role             |             | country, address     |
       | accountStatus    |             | verificationStatus   |
       +--------+---------+             +----------+-----------+
                ^                                  ^
                | 1                                | 1
                |                                  |
                | 1                                | *
       +--------+---------+             +----------+-----------+
       |  WorkerProfile   |             |     VerifiedJob      |
       |------------------|             |----------------------|
       | _id              |             | _id                  |
       | userId (Ref: User|             | employerId (Ref)     |
       | skills, lang     |             | title, salary        |
       | TTCVerification  |             | overtimePolicy       |
       | identityStatus   |             | status               |
       +--------+---------+             +----------+-----------+
                ^                                  ^
                | 1                                | 1
                |                                  |
                +----------------+  +--------------+
                                 |  |
                                 v  v
                     +---------------------------+
                     |     WorkerApplication     |
                     |---------------------------|
                     | _id                       |
                     | workerId (Ref: Worker)    |
                     | jobId (Ref: VerifiedJob)  |
                     | employerId (Ref: Employer)|
                     | applicationStatus         |
                     | submittedDocuments        |
                     +-------------+-------------+
                                   | 1
                    +--------------+--------------+
                    | 1                           | 1
                    v                             v
       +-------------------------+   +-------------------------+
       |     EscrowMilestone     |   |      ContractAudit      |
       |-------------------------|   |-------------------------|
       | _id                     |   | _id                     |
       | applicationId (Ref)     |   | applicationId (Ref)     |
       | employerId (Ref)        |   | employerId (Ref)        |
       | workerId (Ref)          |   | workerId (Ref)          |
       | totalContractualAmount  |   | workerFeeDeclaration    |
       | milestones [            |   | salaryTransparency      |
       |   { milestoneType,      |   | legalComplianceChecks   |
       |     percentage,         |   | auditFindings           |
       |     status,             |   | complianceStatus        |
       |     verifiedAt }        |   | reviewedBy (Ref: User)  |
       | ]                       |   +-------------------------+
       | releaseStatus           |
       +-------------------------+
```

---

## Data Models Detail

### 1. User
- `name`: String (Required, trimmed, min 2 chars)
- `email`: String (Required, unique, lowercase, trimmed, validated email format)
- `passwordHash`: String (Required, bcrypt hashed)
- `role`: String enum [`SUPER_ADMIN`, `ADMIN`, `EMPLOYER`, `WORKER`, `COMPLIANCE_OFFICER`]
- `accountStatus`: String enum [`PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `DEACTIVATED`]
- `emailVerified`: Boolean (Default: false)
- `emailVerificationToken`: String (Hashed single-use token)
- `passwordResetToken`: String (Hashed short-lived token)
- `passwordResetExpires`: Date
- `failedLoginAttempts`: Number (Default: 0)
- `lockUntil`: Date
- `refreshTokenHash`: String (Hashed current active refresh token)
- `lastLogin`: Date
- `timestamps`: createdAt, updatedAt

### 2. Employer
- `userId`: ObjectId (Ref: User, unique index)
- `companyName`: String (Required, indexed)
- `registrationNumber`: String (Required, unique index)
- `country`: String (Required, ISO code or country name)
- `address`: { street, city, state, postalCode }
- `representative`: { name, title, phone, email }
- `businessEmail`: String (Required)
- `website`: String
- `verificationDocuments`: [{ title, documentType, fileUrl, uploadedAt, verified }]
- `verificationStatus`: String enum [`PENDING`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`, `SUSPENDED`]
- `verifiedAt`: Date
- `rejectionReason`: String
- `timestamps`: createdAt, updatedAt

### 3. Worker
- `userId`: ObjectId (Ref: User, unique index)
- `skills`: [String] (Indexed)
- `education`: [{ institution, degree, fieldOfStudy, yearCompleted }]
- `experience`: [{ company, role, durationYears, description }]
- `certifications`: [{ name, issuingOrganization, issueDate, credentialUrl }]
- `languageSkills`: [{ language, proficiencyLevel }]
- `TTCVerification`: { isVerified: Boolean, certificateNumber: String, verifiedAt: Date, centerName: String }
- `identityVerificationStatus`: String enum [`UNVERIFIED`, `SUBMITTED`, `VERIFIED`, `REJECTED`]
- `profileVisibility`: String enum [`PUBLIC`, `EMPLOYERS_ONLY`, `PRIVATE`]
- `timestamps`: createdAt, updatedAt

### 4. VerifiedJob
- `employerId`: ObjectId (Ref: Employer, indexed)
- `title`: String (Required, indexed)
- `description`: String (Required)
- `country`: String (Required, indexed)
- `city`: String (Required)
- `industry`: String (Required, indexed)
- `requiredSkills`: [String]
- `vacancies`: Number (Default: 1)
- `salary`: { min: Number, max: Number, base: Number }
- `currency`: String (Default: 'USD')
- `overtimePolicy`: String (Transparent rate policy)
- `housingTerms`: String (Provided / Allowance)
- `medicalTerms`: String (Health insurance provided)
- `workingHours`: Number (Standard hours/week)
- `weeklyHolidays`: Number (Days/week)
- `contractDuration`: String (e.g., '2 Years')
- `visaRequirements`: String
- `contractDocument`: { fileUrl: String, version: String }
- `status`: String enum [`DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `ARCHIVED`, `CLOSED`]
- `timestamps`: createdAt, updatedAt

### 5. WorkerApplication
- `workerId`: ObjectId (Ref: Worker, indexed)
- `jobId`: ObjectId (Ref: VerifiedJob, indexed)
- `employerId`: ObjectId (Ref: Employer, indexed)
- `applicationStatus`: String enum [`APPLIED`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `OFFERED`, `CONTRACT_SIGNED`, `REJECTED`, `WITHDRAWN`]
- `submittedDocuments`: [{ documentType, fileUrl, uploadedAt }]
- `interviewDetails`: { scheduledAt: Date, meetingLink: String, notes: String }
- `complianceStatus`: String enum [`PENDING_AUDIT`, `COMPLIANT`, `FLAGGED`]
- `timestamps`: createdAt, updatedAt

### 6. EscrowMilestone
- `applicationId`: ObjectId (Ref: WorkerApplication, unique index)
- `employerId`: ObjectId (Ref: Employer, indexed)
- `workerId`: ObjectId (Ref: Worker, indexed)
- `totalContractualAmount`: Number (Required)
- `currency`: String (Default: 'USD')
- `milestones`: [
  - `milestoneType`: Enum [`VISA_VERIFIED`, `SAFE_ARRIVAL_PASSPORT_CONFIRMED`, `DAY_30_WELFARE_CHECKIN`]
  - `percentage`: Number (30, 30, 40)
  - `allocatedAmount`: Number
  - `status`: Enum [`LOCKED`, `ELIGIBLE`, `RELEASED`, `DISPUTED`]
  - `evidenceDocuments`: [String]
  - `verifiedBy`: ObjectId (Ref: User)
  - `verifiedAt`: Date
  - `notes`: String
]
- `releaseStatus`: Enum [`HELD_IN_ESCROW`, `PARTIALLY_RELEASED`, `FULLY_RELEASED`, `REFUNDED`]
- `idempotencyKey`: String (Unique)
- `transactionReference`: String (Cryptographic hash)
- `auditHistory`: [{ action, actorId, previousState, newState, timestamp, reason }]

### 7. ContractAudit
- `applicationId`: ObjectId (Ref: WorkerApplication, unique index)
- `employerId`: ObjectId (Ref: Employer, indexed)
- `workerId`: ObjectId (Ref: Worker, indexed)
- `contractVersion`: String
- `contractDocument`: String
- `workerFeeDeclaration`: { isZeroFeeCompliant: Boolean, signedDeclarationUrl: String, verifiedAt: Date }
- `salaryTransparency`: { meetsStatutoryMinimum: Boolean, statedMonthlyBase: Number, currency: String }
- `legalComplianceChecks`: [{ checkName: String, passed: Boolean, notes: String }]
- `auditFindings`: [String]
- `complianceScore`: Number (0 to 100)
- `complianceStatus`: Enum [`PENDING`, `VERIFIED_COMPLIANT`, `NON_COMPLIANT`, `FLAGGED_FOR_INVESTIGATION`]
- `reviewedBy`: ObjectId (Ref: User)
- `reportReferenceId`: String (Unique)

### 8. AuditLog
- `userId`: ObjectId (Ref: User)
- `action`: String (Required, indexed)
- `resourceType`: String (Required)
- `resourceId`: String
- `ipAddress`: String
- `userAgent`: String
- `metadata`: Schema.Types.Mixed
- `timestamp`: Date (Default: Date.now, indexed)
