const { z } = require('zod');
const { ROLES } = require('../constants/roles');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_-])[A-Za-z\d@$!%*?&#^_-]{8,}$/;

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    ),
  role: z.enum([ROLES.WORKER, ROLES.EMPLOYER, ROLES.COMPLIANCE_OFFICER, ROLES.ADMIN]),
  
  // Specific fields for Employer
  employerData: z
    .object({
      companyName: z.string().min(2, 'Company name is required'),
      registrationNumber: z.string().min(3, 'Business registration number is required'),
      country: z.string().min(2, 'Country is required'),
      city: z.string().min(2, 'City is required'),
      representativeName: z.string().min(2, 'Representative name is required'),
      representativeTitle: z.string().min(2, 'Representative title is required'),
      phone: z.string().min(5, 'Phone number is required'),
      businessEmail: z.string().email('Valid business email is required'),
      website: z.string().optional(),
    })
    .optional(),

  // Specific fields for Worker
  workerData: z
    .object({
      skills: z.array(z.string()).optional(),
      zeroFeeAffidavitConfirmed: z.literal(true, {
        errorMap: () => ({ message: 'You must acknowledge the zero-fee recruitment policy' }),
      }),
    })
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(10, 'Valid reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

/**
 * Generic Zod validation middleware generator
 */
const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const details = error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed: Invalid input payload',
      error: {
        code: 'VALIDATION_ERROR',
        details,
      },
    });
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  validate,
};
