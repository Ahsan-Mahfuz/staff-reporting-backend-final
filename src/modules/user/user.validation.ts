import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().optional(),
})

export const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const verificationCodeSchema = z.object({
  code: z
    .number()
    .int('Invalid code')
    .min(10000, 'Code must be 5 digits')
    .max(99999, 'Code must be 5 digits'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
})

export const setNewPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>
export type VerificationCodeSchema = z.infer<typeof verificationCodeSchema>
export type SetNewPasswordSchema = z.infer<typeof setNewPasswordSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
