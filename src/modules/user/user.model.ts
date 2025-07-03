import { Schema, model } from 'mongoose'

interface IUser {
  name: string
  email: string
  password: string
  resetCode?: number | null
  resetCodeExpires: Date | null
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetCode: {
      type: Number,
      default: null,
    },
    resetCodeExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

export const UserModel = model<IUser>('User', userSchema)
