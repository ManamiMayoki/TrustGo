const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { connectDB, disconnectDB } = require('../config/database');
const {
  User,
  Employer,
  Worker,
  VerifiedJob,
  WorkerApplication,
  EscrowMilestone,
  ContractAudit,
  AuditLog,
} = require('../models');
const { ROLES } = require('../constants/roles');
const {
  ACCOUNT_STATUS,
  EMPLOYER_VERIFICATION_STATUS,
  JOB_STATUS,
  APPLICATION_STATUS,
  ESCROW_MILESTONES,
  MILESTONE_STATUS,
  ESCROW_RELEASE_STATUS,
  COMPLIANCE_STATUS,
} = require('../constants/statuses');

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database. Purging existing seed data...');

    await Promise.all([
      User.deleteMany({}),
      Employer.deleteMany({}),
      Worker.deleteMany({}),
      VerifiedJob.deleteMany({}),
      WorkerApplication.deleteMany({}),
      EscrowMilestone.deleteMany({}),
      ContractAudit.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    const defaultPassword = 'Password123!@#';
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    console.log('[Seed] Creating role-based users...');

    // 1. Super Admin
    const superAdmin = await User.create({
      name: 'TrustGo Super Admin',
      email: 'superadmin@trustgo.com',
      passwordHash,
      role: ROLES.SUPER_ADMIN,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      emailVerified: true,
    });

    // 2. Platform Admin
    const admin = await User.create({
      name: 'Elena Rostova',
      email: 'admin@trustgo.com',
      passwordHash,
      role: ROLES.ADMIN,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      emailVerified: true,
    });

    // 3. Compliance Officer
    const complianceOfficer = await User.create({
      name: 'Farhan Kabir, Esq.',
      email: 'compliance@trustgo.com',
      passwordHash,
      role: ROLES.COMPLIANCE_OFFICER,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      emailVerified: true,
    });

    // 4. International Employers (GCC, Europe, East Asia)
    const employerUserUAE = await User.create({
      name: 'Tariq Al-Mansoor',
      email: 'tariq@almansoor-contracting.ae',
      passwordHash,
      role: ROLES.EMPLOYER,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      emailVerified: true,
    });

    const employerUAE = await Employer.create({
      userId: employerUserUAE._id,
      companyName: 'Al-Mansoor Construction & Infrastructure LLC',
      registrationNumber: 'DXB-CORP-98421-UAE',
      country: 'United Arab Emirates',
      address: { street: 'Sheikh Zayed Rd, Tower 4', city: 'Dubai', state: 'Dubai', postalCode: '00000' },
      representative: { name: 'Tariq Al-Mansoor', title: 'Director of HR & Global Mobility', phone: '+971 4 800 2345', email: 'tariq@almansoor-contracting.ae' },
      businessEmail: 'tariq@almansoor-contracting.ae',
      website: 'https://almansoor-contracting.ae',
      verificationStatus: EMPLOYER_VERIFICATION_STATUS.VERIFIED,
      verifiedAt: new Date(),
      verifiedBy: admin._id,
      esgRating: { score: 96, tier: 'A', lastAudited: new Date() },
    });

    const employerUserPoland = await User.create({
      name: 'Marek Wisniewski',
      email: 'm.wisniewski@balticenergy.pl',
      passwordHash,
      role: ROLES.EMPLOYER,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      emailVerified: true,
    });

    const employerPoland = await Employer.create({
      userId: employerUserPoland._id,
      companyName: 'Baltic Clean Energy & Infrastructure Sp. z o.o.',
      registrationNumber: 'KRS-0000845920-PL',
      country: 'Poland',
      address: { street: 'ul. Marszalkowska 104', city: 'Warsaw', state: 'Mazovia', postalCode: '00-017' },
      representative: { name: 'Marek Wisniewski', title: 'Talent Acquisition VP', phone: '+48 22 555 0192', email: 'm.wisniewski@balticenergy.pl' },
      businessEmail: 'm.wisniewski@balticenergy.pl',
      website: 'https://balticenergy.pl',
      verificationStatus: EMPLOYER_VERIFICATION_STATUS.VERIFIED,
      verifiedAt: new Date(),
      verifiedBy: admin._id,
      esgRating: { score: 98, tier: 'A', lastAudited: new Date() },
    });

    // 5. Bangladeshi Migrant Workers
    const workerUser1 = await User.create({
      name: 'Mohammad Rahim Uddin',
      email: 'rahim.uddin@gmail.com',
      passwordHash,
      role: ROLES.WORKER,
      accountStatus: ACCOUNT_STATUS.ACTIVE,
      emailVerified: true,
    });

    const worker1 = await Worker.create({
      userId: workerUser1._id,
      skills: ['Electrical Installation', 'HVAC Maintenance', 'Industrial Wiring', 'Safety Protocol Certified'],
      education: [{ institution: 'Dhaka Polytechnic Institute', degree: 'Diploma in Electrical Engineering', fieldOfStudy: 'Electrical', yearCompleted: 2022 }],
      experience: [{ company: 'Pran-RFL Industrial Plant', role: 'Maintenance Technician', durationYears: 3, description: 'Preventive and corrective maintenance of heavy industrial machinery.' }],
      languageSkills: [
        { language: 'Bengali', proficiencyLevel: 'NATIVE' },
        { language: 'English', proficiencyLevel: 'INTERMEDIATE' },
        { language: 'Arabic', proficiencyLevel: 'BASIC' },
      ],
      TTCVerification: {
        isVerified: true,
        certificateNumber: 'BMET-TTC-DHK-2023-8849',
        verifiedAt: new Date(),
        centerName: 'Bangladesh-Korea Technical Training Centre (BKTTC), Mirpur, Dhaka',
      },
      identityVerificationStatus: 'VERIFIED',
      zeroFeeDeclarationSigned: true,
    });

    console.log('[Seed] Creating verified transparent jobs...');

    // 6. Verified Jobs
    const job1 = await VerifiedJob.create({
      employerId: employerUAE._id,
      title: 'Senior Industrial Electrical Technician',
      description:
        'Oversee wiring, power distribution units, and electrical compliance for landmark infrastructure in Dubai. Direct employer recruitment with zero fees charged to candidates.',
      country: 'United Arab Emirates',
      city: 'Dubai',
      industry: 'Infrastructure & Construction',
      requiredSkills: ['Electrical Installation', 'Industrial Wiring', 'Blueprints Reading'],
      vacancies: 8,
      salary: { base: 1450, min: 1400, max: 1650 },
      currency: 'USD',
      overtimePolicy: '1.25x standard hourly rate for weekday overtime, 1.5x for weekend/holiday work in strict compliance with UAE Federal Decree-Law No. 33.',
      housingTerms: 'Furnished air-conditioned accommodation with Wi-Fi, utilities, and dedicated catering provided free of charge.',
      medicalTerms: 'Comprehensive group medical insurance covering inpatient, outpatient, and emergency repatriation.',
      workingHours: 48,
      weeklyHolidays: 1,
      contractDuration: '2 Years (Renewable with mutual consent)',
      visaRequirements: 'Employment residence visa and medical fitness card fully covered by employer.',
      zeroWorkerFeeGuarantee: true,
      status: JOB_STATUS.PUBLISHED,
    });

    const job2 = await VerifiedJob.create({
      employerId: employerPoland._id,
      title: 'Solar PV Systems Installation Specialist',
      description:
        'Join expanding renewable energy projects across Central Europe. Full EU legal work permit, direct sponsorship, and guaranteed equal workplace protections under Polish labor law.',
      country: 'Poland',
      city: 'Warsaw',
      industry: 'Renewable Energy',
      requiredSkills: ['Solar Installation', 'Electrical Troubleshooting', 'Working at Heights Certified'],
      vacancies: 12,
      salary: { base: 1850, min: 1800, max: 2100 },
      currency: 'EUR',
      overtimePolicy: 'Overtime paid at 150% rate as governed by Polish Labour Code (Kodeks pracy).',
      housingTerms: 'Employer-subsidized individual private studio apartment with utilities paid.',
      medicalTerms: 'Full NFZ (National Health Fund) statutory coverage + private supplemental medical insurance.',
      workingHours: 40,
      weeklyHolidays: 2,
      contractDuration: '3 Years (Work Permit Type A)',
      visaRequirements: 'National D-type work visa sponsored directly through the Mazovian Voivodeship Office.',
      zeroWorkerFeeGuarantee: true,
      status: JOB_STATUS.PUBLISHED,
    });

    console.log('[Seed] Creating sample application, escrow milestones & audit report...');

    // 7. Worker Application
    const application1 = await WorkerApplication.create({
      workerId: worker1._id,
      jobId: job1._id,
      employerId: employerUAE._id,
      applicationStatus: APPLICATION_STATUS.CONTRACT_SIGNED,
      submittedDocuments: [
        { documentType: 'PASSPORT_COPY', fileUrl: 'https://assets.trustgo.com/docs/demo_passport_redacted.pdf', verified: true },
        { documentType: 'TTC_CERTIFICATE', fileUrl: 'https://assets.trustgo.com/docs/demo_ttc_certificate.pdf', verified: true },
        { documentType: 'SIGNED_CONTRACT', fileUrl: 'https://assets.trustgo.com/docs/demo_employment_contract.pdf', verified: true },
      ],
      workerZeroFeeAffidavit: {
        confirmed: true,
        affidavitTimestamp: new Date(),
        signatureStatement: 'I confirm that I have paid zero recruitment or placement fees for this application.',
      },
    });

    // 8. Milestone Escrow
    const escrow1 = await EscrowMilestone.create({
      applicationId: application1._id,
      employerId: employerUAE._id,
      workerId: worker1._id,
      totalContractualAmount: 2900,
      currency: 'USD',
      releaseStatus: ESCROW_RELEASE_STATUS.PARTIALLY_RELEASED,
      idempotencyKey: crypto.randomUUID(),
      transactionReference: 'TX-DXB-2026-98104',
      milestones: [
        {
          milestoneType: ESCROW_MILESTONES.VISA_VERIFIED,
          percentage: 30,
          allocatedAmount: 870,
          status: MILESTONE_STATUS.RELEASED,
          verifiedBy: admin._id,
          verifiedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          releaseTransactionHash: 'REL-09AF-VISA-VERIFIED',
          notes: 'UAE residency visa issued and verified via UAE GDRFA labor gateway.',
        },
        {
          milestoneType: ESCROW_MILESTONES.SAFE_ARRIVAL_PASSPORT_CONFIRMED,
          percentage: 30,
          allocatedAmount: 870,
          status: MILESTONE_STATUS.RELEASED,
          verifiedBy: admin._id,
          verifiedAt: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
          releaseTransactionHash: 'REL-77BC-SAFE-ARRIVAL',
          notes: 'Flight EK583 confirmed arrived DXB. Worker confirmed physical passport possession.',
        },
        {
          milestoneType: ESCROW_MILESTONES.DAY_30_WELFARE_CHECKIN,
          percentage: 40,
          allocatedAmount: 1160,
          status: MILESTONE_STATUS.ELIGIBLE,
          welfareCheckInData: {
            voiceNoteUrl: 'https://assets.trustgo.com/audio/sample_bengali_welfare_checkin.mp3',
            bengaliTranscript: 'আমি দুবাইতে ভালো আছি। কোম্পানির কাজে ও থাকা-খাওয়ায় কোনো সমস্যা নেই। বেতন চুক্তিমতো পেয়েছি, পাসপোর্ট আমার কাছেই আছে।',
            englishTranslation: 'I am doing well in Dubai. Company work and living arrangements have no issues. Salary paid as contracted, and I hold my passport.',
            welfareScore: 10,
            workerReportedCondition: {
              passportInPossession: true,
              salaryPaidAsContracted: true,
              safeAccommodations: true,
            },
            verifiedAt: new Date(),
          },
          notes: 'Eligible for final release upon compliance sign-off.',
        },
      ],
      auditHistory: [
        {
          action: 'ESCROW_INITIALIZED',
          actorId: admin._id,
          previousState: 'NONE',
          newState: ESCROW_RELEASE_STATUS.HELD_IN_ESCROW,
          timestamp: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          reason: 'Application accepted and funded by employer',
        },
        {
          action: 'MILESTONE_RELEASED_VISA_VERIFIED',
          actorId: admin._id,
          previousState: MILESTONE_STATUS.LOCKED,
          newState: MILESTONE_STATUS.RELEASED,
          timestamp: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
          reason: 'Visa verified with UAE ministry records',
        },
        {
          action: 'MILESTONE_RELEASED_SAFE_ARRIVAL_PASSPORT_CONFIRMED',
          actorId: admin._id,
          previousState: MILESTONE_STATUS.LOCKED,
          newState: MILESTONE_STATUS.RELEASED,
          timestamp: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000),
          reason: 'Safe arrival verified; passport possession confirmed by Rahim',
        },
      ],
    });

    // 9. Contract Audit
    const audit1 = await ContractAudit.create({
      applicationId: application1._id,
      employerId: employerUAE._id,
      workerId: worker1._id,
      contractVersion: '1.0',
      workerFeeDeclaration: {
        isZeroFeeCompliant: true,
        verifiedAt: new Date(),
        auditorNotes: 'Worker explicitly affirmed paying zero taka to any agency or middleman.',
      },
      salaryTransparency: {
        meetsStatutoryMinimum: true,
        statedMonthlyBase: 1450,
        currency: 'USD',
        timelyPaymentGuaranteed: true,
      },
      legalComplianceChecks: [
        { checkName: 'Zero Worker Placement Fee', category: 'FEES', passed: true, standardReference: 'ILO Convention 181, Article 7(1)', notes: '100% employer financed recruitment.' },
        { checkName: 'No Passport Withholding Guarantee', category: 'HUMAN_RIGHTS', passed: true, standardReference: 'Palermo Protocol & UAE Labor Law', notes: 'Worker in sole custody of travel documents.' },
        { checkName: 'Transparent Wage Specification', category: 'CONTRACT_TERMS', passed: true, standardReference: 'ILO Convention 95', notes: 'Base monthly USD 1,450 guaranteed in electronic wage protection system (WPS).' },
        { checkName: 'Safe Lodging & Medical Terms', category: 'WELFARE', passed: true, standardReference: 'ILO Recommendation 115', notes: 'Employer-provided air-conditioned lodging and full insurance.' },
        { checkName: 'Authentic BMET TTC Certification', category: 'LEGAL_STATUS', passed: true, standardReference: 'Bangladesh Overseas Employment Act 2013', notes: 'BMET clearance approved.' },
      ],
      auditFindings: ['Flawless ethical recruitment compliance. Zero fees paid, welfare validated on Day 30.'],
      complianceScore: 100,
      complianceStatus: COMPLIANCE_STATUS.VERIFIED_COMPLIANT,
      reportReferenceId: 'AUD-TG-2026-DXB-001',
      frameworkStandard: 'ILO_CONVENTION_181',
      reviewedBy: complianceOfficer._id,
    });

    console.log('[Seed] Database seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Seed Credentials (Password: Password123!@#)');
    console.log('Super Admin:       superadmin@trustgo.com');
    console.log('Admin:             admin@trustgo.com');
    console.log('Compliance Officer: compliance@trustgo.com');
    console.log('Employer (UAE):    tariq@almansoor-contracting.ae');
    console.log('Employer (Poland): m.wisniewski@balticenergy.pl');
    console.log('Worker:            rahim.uddin@gmail.com');
    console.log('----------------------------------------------------');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
