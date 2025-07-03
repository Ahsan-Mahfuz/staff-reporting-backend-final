import { Schema, Types, model } from 'mongoose'

interface IClient {
  name: string
  userId: string
  rates: number
  location?: string
  phoneNumber: string
  clientImage?: Buffer
  createdBy: Types.ObjectId
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
  },
  { timestamps: true }
)

export const ClientModel = model<IClient>('Client', clientSchema)
