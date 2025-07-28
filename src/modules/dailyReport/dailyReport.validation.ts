import { stat } from 'fs'
import { z } from 'zod'

export const createDailyReportZod = z.object({
  checkInTime: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: 'Invalid time format, use 24 hour format',
    }),
  checkOutTime: z
    .string()
    .optional()
    .refine((val) => !val || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val), {
      message: 'Invalid time format, use 24 hour format',
    }),
  breakTime: z
    .string()
    .optional()
    .refine((val) => !val || ['30 minutes', '1 hour', '0'].includes(val), {
      message: 'Break time must be either 30 minutes, 1 hour, or 0',
    }),
  date: z
    .string({
      required_error: 'Date is required',
      invalid_type_error: 'Date must be a string',
    })
    .min(1, 'Date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  additionalUserId: z.array(z.string()).optional(),
  clientId: z.string().optional(),
  jobLocation: z.string().optional(),
  travelTime: z.string().optional(),
  jobNumber: z.string().optional(),
  workDescription: z.string().optional(),
  stayAwayFromHome: z.string().optional(),
  issueOrDelays: z.string().optional(),
  issueOrDelaysImage: z.string().optional(),
  mileageLogged: z.string().optional(),
  photoOrFileUploaded: z.string().optional(),
  anyWastedMaterial: z.string().optional(),
  expensesIncurred: z.string().optional(),
  expensesIncurredImage: z.string().optional(),
  addAdditionalNotes: z.string().optional(),
  urgent: z.string().optional(),
  staffRef: z.string().optional(),
  createdBy: z.string().optional(),
  status: z.enum(['Pending', 'Approved', 'Canceled']).default('Pending'),
})

export const updateDailyReportZod = createDailyReportZod.partial()
