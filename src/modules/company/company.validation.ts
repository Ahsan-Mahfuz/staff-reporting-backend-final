import { z } from 'zod'

export const companySchema = z.object({
  color: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
      message: 'Color must be a valid hex code',
    })
    .optional()
    .or(z.literal(null))
    .or(z.literal('')),

  logoImage: z
    .string()
    .refine(
      (val) => {
        if (!val) return true
        const imageTypes = ['image/jpeg', 'image/png', 'image/jpg']
        return imageTypes.includes(val)
      },
      {
        message: 'Logo image must be a valid image type (jpeg,jpg, png)',
      }
    )
    .optional()
    .or(z.literal(null))
    .or(z.literal('')),
})

export type CompanySchema = z.infer<typeof companySchema>
