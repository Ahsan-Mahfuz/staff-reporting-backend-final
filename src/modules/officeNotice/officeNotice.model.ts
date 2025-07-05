import { Schema, Types, model } from 'mongoose'

interface IOfficeNotice {
  file: string
  createdBy: Types.ObjectId
}

const officeNoticeSchema = new Schema<IOfficeNotice>(
  {
    file: {
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

export const OfficeNoticeModel = model<IOfficeNotice>(
  'OfficeNotice',
  officeNoticeSchema
)
