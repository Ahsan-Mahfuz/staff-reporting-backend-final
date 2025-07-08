import { z } from 'zod'

export const staffLoginSchema = z.object({
  staffId: z.string(),
  password: z.string(),
})
