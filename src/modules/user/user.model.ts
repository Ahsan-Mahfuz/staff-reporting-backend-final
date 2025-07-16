import { Schema, model } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password: string
  resetCode?: number | null
  resetCodeExpires: Date | null
  profileImage?: string | null
  role: string
  color: string
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
    color: {
      type: String,
      required: true,
      default: '#FF0000',
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
    role: {
      type: String,
      required: true,
      default: 'admin',
    },
  },
  { timestamps: true }
)

export const UserModel = model<IUser>('User', userSchema)
