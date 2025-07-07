import { Schema, Types, model } from 'mongoose'

interface IOfficeTimeTable {
  checkInTime: string
  checkOutTime: string
  createdBy: Types.ObjectId
}

const officeTimeTableSchema = new Schema<IOfficeTimeTable>(
  {
    checkInTime: {
      type: String,
      required: true,
    },
    checkOutTime: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

export const OfficeTimeTableModel = model<IOfficeTimeTable>(
  'OfficeTimeTable',
  officeTimeTableSchema
)
