import { Schema, Types, model } from 'mongoose'

interface ICalender {
  staffId?: Types.ObjectId
  date?: Date
  createdBy: Types.ObjectId
  color?: string
}

const calenderSchema = new Schema<ICalender>(
  {
    staffId: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const CalenderModel = model<ICalender>('Calender', calenderSchema)
