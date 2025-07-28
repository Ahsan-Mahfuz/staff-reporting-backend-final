import { Schema, Types, model } from 'mongoose'

interface IDailyReport {
  checkInTime?: string
  checkOutTime?: string
  breakTime?: string
  date: Date
  additionalUserId?: string[]
  clientId?: Types.ObjectId
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
  createdBy: Types.ObjectId
  status: string
}

const dailyReportSchema = new Schema<IDailyReport>(
  {
    checkInTime: { type: String, default: '0' },
    checkOutTime: { type: String, default: '0' },
    breakTime: { type: String, default: '0' },
    date: {
      type: Date,
      required: true,
    },
    additionalUserId: {
      type: [String],
      default: [],
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    jobLocation: { type: String, default: null },
    travelTime: { type: String, default: null },
    jobNumber: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    workDescription: { type: String, default: null },
    stayAwayFromHome: { type: String, default: false },
    issueOrDelays: { type: String, default: null },
    issueOrDelaysImage: { type: String, default: null },
    mileageLogged: { type: String, default: null },
    photoOrFileUploaded: { type: String, default: null },
    anyWastedMaterial: { type: String, default: false },
    expensesIncurred: { type: String, default: null },
    expensesIncurredImage: { type: String, default: null },
    addAdditionalNotes: { type: String, default: null },
    urgent: { type: String, default: false },
    staffRef: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Canceled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
)

export const DailyReportModel = model<IDailyReport>(
  'DailyReport',
  dailyReportSchema
)
