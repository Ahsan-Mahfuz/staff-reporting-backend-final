import { Schema, Types, model } from 'mongoose'

interface ISendReminder {
  staffId: Types.ObjectId
  date: Date
  file?: string
  desc?: string
  createdBy: Types.ObjectId
}

const sendReminderSchema = new Schema<ISendReminder>(
  {
    staffId: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    file: {
      type: String,
      required: false,
    },
    desc: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const SendReminderModel = model<ISendReminder>(
  'SendReminder',
  sendReminderSchema
)
