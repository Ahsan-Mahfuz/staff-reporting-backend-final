import { Schema, Types, model } from 'mongoose'

interface ICompany {
  logoImage?: string | null
  color?: string | null
  createdBy: Types.ObjectId
}

const companySchema = new Schema<ICompany>(
  {
    logoImage: {
      type: String,
      required: false,
      default: null,
    },
    color: {
      type: String,
      required: false,
      default: "#FF0000",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const CompanyModel = model<ICompany>('Company', companySchema)
