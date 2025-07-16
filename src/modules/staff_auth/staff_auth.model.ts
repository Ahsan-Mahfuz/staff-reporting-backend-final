import { Schema, Types, model } from 'mongoose'
import { IUser } from '../user/user.model'

export interface IStaffAuth {
  staffId: string
  password: string
  createdBy: Types.ObjectId | IUser
}

const staffAuthSchema = new Schema<IStaffAuth>(
  {
    password: {
      type: String,
      required: true,
    },

    staffId: {
      type: String,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',  
      required: true,
    },
  },
  { timestamps: true }
)

export const StaffAuthModel = model<IStaffAuth>('StaffAuth', staffAuthSchema)
