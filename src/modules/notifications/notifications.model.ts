import { Schema, Types, model } from 'mongoose'

interface INotifications {
  staffId?: Types.ObjectId
  date?: Date
  status?: string
  officeNotice?: string
  createdBy: Types.ObjectId
  sendTo?: string
  reminderId?: Types.ObjectId
}

const notificationsSchema = new Schema<INotifications>(
  {
    staffId: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['unread', 'read'],
      default: 'unread',
    },
    officeNotice: {
      type: String,
      required: false,
    },
    reminderId: {
      type: Schema.Types.ObjectId,
      ref: 'SendReminder',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sendTo: {
      type: String,
      enum: ['staff', 'admin'],
    },
  },
  { timestamps: true }
)

export const NotificationModel = model<INotifications>(
  'Notification',
  notificationsSchema
)
