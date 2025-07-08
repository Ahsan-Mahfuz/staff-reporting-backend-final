import { Schema, model } from 'mongoose'

interface IUser {
  name: string
  email: string
  password: string
  resetCode?: number | null
  resetCodeExpires: Date | null
  profileImage?: string | null
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
    profileImage: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
)

export const UserModel = model<IUser>('User', userSchema)
