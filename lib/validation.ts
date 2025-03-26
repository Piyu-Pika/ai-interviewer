import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: emailSchema,
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'recruiter', 'candidate']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = createUserSchema.partial();

// Interview validation schemas
export const interviewSchema = z.object({
  id: z.string().uuid(),
  candidateId: z.string().uuid(),
  recruiterId: z.string().uuid(),
  jobId: z.string().uuid(),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  scheduledAt: z.date(),
  duration: z.number().min(15).max(120),
  feedback: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createInterviewSchema = interviewSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateInterviewSchema = createInterviewSchema.partial();

// Job validation schemas
export const jobSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string()),
  location: z.string().optional(),
  salary: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string().default('USD'),
  }).optional(),
  status: z.enum(['draft', 'published', 'closed']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createJobSchema = jobSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateJobSchema = createJobSchema.partial();

// Validation helper functions
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export function validatePartial<T extends z.ZodObject<any>>(schema: T, data: unknown): Partial<z.infer<T>> {
  return schema.partial().parse(data);
}

export function validateArray<T>(schema: z.ZodSchema<T>, data: unknown[]): T[] {
  return z.array(schema).parse(data);
} 