const { z } = require('zod');

const createJobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  description: z.string().min(20, 'Job description must be at least 20 characters'),
  country: z.string().min(2, 'Country destination is required'),
  city: z.string().min(2, 'City is required'),
  industry: z.string().min(2, 'Industry sector is required'),
  requiredSkills: z.array(z.string()).min(1, 'At least one required skill must be listed'),
  vacancies: z.number().int().positive().default(1),
  salary: z.object({
    base: z.number().positive('Base salary must be positive'),
    min: z.number().positive().optional(),
    max: z.number().positive().optional(),
  }),
  currency: z.string().min(3).max(3).default('USD'),
  overtimePolicy: z.string().min(5, 'Overtime compensation policy must be declared transparently'),
  housingTerms: z.string().min(5, 'Housing terms must be clearly stated'),
  medicalTerms: z.string().min(5, 'Medical coverage terms must be clearly stated'),
  workingHours: z.number().min(20).max(60).default(48),
  weeklyHolidays: z.number().min(1).max(3).default(1),
  contractDuration: z.string().min(2, 'Contract duration must be specified'),
  visaRequirements: z.string().min(5, 'Visa processing conditions must be described'),
  zeroWorkerFeeGuarantee: z.literal(true, {
    errorMap: () => ({ message: 'Employer must guarantee zero worker-paid recruitment fees' }),
  }),
});

const updateJobSchema = createJobSchema.partial();

module.exports = {
  createJobSchema,
  updateJobSchema,
};
