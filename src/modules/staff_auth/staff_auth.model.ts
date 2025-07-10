import { Schema, Types, model } from 'mongoose'

interface IStaffAuth {
  staffId: string
  password: string
  createdBy: Types.ObjectId
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
