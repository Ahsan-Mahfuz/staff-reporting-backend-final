import express from 'express'
import {
  forgetPasswordUser,
  loginUser,
  registerUser,
  setNewPasswordUser,
  verificationCodeUser,
} from './user.controller'
import { verifyCodeTokenMiddleware } from '../../middlewares/verifyCodeTokenMiddleware'

const userRoutes = express.Router()

userRoutes.post('/register', registerUser)
userRoutes.post('/signin', loginUser)
userRoutes.post('/forget-password', forgetPasswordUser)
userRoutes.post('/verify-code', verificationCodeUser)
userRoutes.post(
  '/set-new-password',
  verifyCodeTokenMiddleware,
  setNewPasswordUser
)

export default userRoutes
