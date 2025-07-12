import { z } from 'zod'

export const createSendReminderZod = z.object({
  staffId: z.string().optional(),

  date: z.string().optional(),

  file: z
    .string()
    .refine(
      (val) => {
        if (!val) return true
        const imageTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/pdf',
        ]
        return imageTypes.includes(val)
      },
      {
        message: 'File must be a valid type: jpeg, jpg, png, or pdf',
      }
    )
    .optional(),

  desc: z.string().max(1000, { message: 'Description too long' }).optional(),
})
export type CreateSendReminderSchema = z.infer<typeof createSendReminderZod>
