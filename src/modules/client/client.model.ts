import { Schema, Types, model } from 'mongoose'

interface IClient {
  name: string
  userId: string
  rates: number
  location?: string
  phoneNumber: string
  clientImage?: string
  createdBy: Types.ObjectId
  isBlocked: boolean
}

const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: true,
    },
    clientImage: {
      type: String,
      required: false,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    rates: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

export const ClientModel = model<IClient>('Client', clientSchema)
