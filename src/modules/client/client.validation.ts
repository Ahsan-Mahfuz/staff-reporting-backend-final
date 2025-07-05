import { z } from 'zod'

export const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().optional(),
  phoneNumber: z.string().min(1, 'PhoneNumber is required'),
  rates: z.number().min(1, 'Rates is required and must be at least 1'),
  clientImage: z
    .string()
    .refine(
      (val) => {
        if (!val) return true
        const imageTypes = ['image/jpeg', 'image/png', 'image/jpg']
        return imageTypes.includes(val)
      },
      {
        message: 'Client image must be a valid image type (jpeg,jpg, png)',
      }
    )
    .optional(),
})

export type CreateSchema = z.infer<typeof createSchema>
