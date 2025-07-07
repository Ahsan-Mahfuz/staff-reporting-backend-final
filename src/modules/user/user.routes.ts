import express from 'express'
import {
  changePasswordUser,
  forgetPasswordUser,
  loginUser,
  registerUser,
  setNewPasswordUser,
  verificationCodeUser,
} from './user.controller'
import { verifyCodeTokenMiddleware } from '../../middlewares/verifyCodeTokenMiddleware'
import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'

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
userRoutes.post('/change-password', authenticateAdmin, changePasswordUser)

export default userRoutes
