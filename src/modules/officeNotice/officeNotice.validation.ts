import { z } from 'zod'

export const createOfficeNoticeSchema = z
  .object({
    file: z.string().refine(
      (val) => {
        if (!val) return true
        const acceptedTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/pdf',
        ]
        return acceptedTypes.includes(val)
      },
      {
        message: 'File must be a valid image type (jpeg,jpg, png) or pdf',
      }
    ),
  })
  .refine((data) => Object.keys(data).length === 1, {
    message: 'Only one file can be uploaded at a time',
  })

export type CreateOfficeNoticeSchema = z.infer<typeof createOfficeNoticeSchema>
