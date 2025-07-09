import { Schema, Types, model } from 'mongoose'

interface IDailyReport {
  trade?: string
  location?: string
  memberSince?: Date
  allergies?: string
  ongoingHealthConcern?: string
  emergencyContactName?: string
  emergencyContactNumber?: string
  emergencyContactAddress?: string
  Qualifications?: string
  staffRef: Types.ObjectId
}

const dailyReportSchema = new Schema<IDailyReport>(
  {
    trade: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    memberSince: {
      type: Date,
      required: false,
    },
    allergies: {
      type: String,
      required: false,
    },
    ongoingHealthConcern: {
      type: String,
      required: false,
    },
    emergencyContactName: {
      type: String,
      required: false,
    },
    emergencyContactNumber: {
      type: String,
      required: false,
    },
    emergencyContactAddress: {
      type: String,
      required: false,
    },
    Qualifications: {
      type: String,
      required: false,
    },
    staffRef: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
  },
  { timestamps: true }
)

export const DailyReportModel = model<IDailyReport>(
  'DailyReport',
  dailyReportSchema
)
