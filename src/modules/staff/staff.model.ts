import { Schema, Types, model } from 'mongoose'

interface IStaff {
  name: string
  staffImage?: string
  staffId: string
  rates: number
  password: string
  phoneNumber?: string
  designation?: string
  createdBy: Types.ObjectId
  isBlocked: boolean
}

const staffSchema = new Schema<IStaff>(
  {
    name: {
      type: String,
      required: true,
    },
    staffImage: {
      type: String,
      required: false,
    },
    designation: {
      type: String,
      required: false,
    },
    staffId: {
      type: String,
      required: true,
      unique: true,
    },
    rates: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const StaffModel = model<IStaff>('Staff', staffSchema)
