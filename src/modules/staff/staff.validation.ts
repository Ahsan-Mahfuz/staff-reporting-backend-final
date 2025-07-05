import { z } from 'zod'

export const createStaffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(1, 'Password is required'),
  phoneNumber: z.string().min(3, 'Phone Number is required'),
  rates: z.number().min(1, 'Rates is required and must be at least 1'),
  designation: z.string().optional(),
  staffImage: z
    .string()
    .refine(
      (val) => {
        if (!val) return true
        const imageTypes = ['image/jpeg', 'image/png', 'image/jpg']
        return imageTypes.includes(val)
      },
      {
        message: 'Staff image must be a valid image type (jpeg,jpg, png)',
      }
    )
    .optional(),
})

export type CreateStaffSchema = z.infer<typeof createStaffSchema>
