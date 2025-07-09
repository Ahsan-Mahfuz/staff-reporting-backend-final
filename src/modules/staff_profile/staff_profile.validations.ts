import { z } from 'zod'

export const updateOwnStaffSchema = z.object({
  // StaffModel fields
  name: z.string().optional(),
  designation: z.string().optional(),
  phoneNumber: z.string().optional(),
  staffImage: z.string().optional(),

  // StaffProfileModel fields
  trade: z.string().optional(),
  location: z.string().optional(),
  memberSince: z.coerce.date().optional(),
  allergies: z.string().optional(),
  ongoingHealthConcern: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  emergencyContactAddress: z.string().optional(),
  Qualifications: z.string().optional(),
})
