import { Schema, Types, model } from 'mongoose'

interface IDailyReport {
  checkInTime?: string
  checkOutTime?: string
  date: Date
  additionalUserId?: Types.ObjectId[]
  clientName?: Types.ObjectId
  jobLocation?: string
  travelTime?: string
  jobNumber?: string
  workDescription?: string
  stayAwayFromHome?: boolean
  issueOrDelays?: string
  issueOrDelaysImage?: string
  mileageLogged?: string
  photoOrFileUploaded?: string
  anyWastedMaterial?: boolean
  expensesIncurred?: string
  expensesIncurredImage?: string
  addAdditionalNotes?: string
  urgent?: boolean
  staffRef: Types.ObjectId
}

const dailyReportSchema = new Schema<IDailyReport>(
  {
    checkInTime: String,
    checkOutTime: String,
    date: {
      type: Date,
      required: true,
    },
    additionalUserId: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        default: null,
      },
    ],
    clientName: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    jobLocation: { type: String, default: null },
    travelTime: { type: String, default: null },
    jobNumber: { type: String, default: null },
    workDescription: { type: String, default: null },
    stayAwayFromHome: { type: Boolean, default: null },
    issueOrDelays: { type: String, default: null },
    issueOrDelaysImage: { type: String, default: null },
    mileageLogged: { type: String, default: null },
    photoOrFileUploaded: { type: String, default: null },
    anyWastedMaterial: { type: Boolean, default: null },
    expensesIncurred: { type: String, default: null },
    expensesIncurredImage: { type: String, default: null },
    addAdditionalNotes: { type: String, default: null },
    urgent: { type: Boolean, default: false },
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
