import express from 'express'
import {
  changePasswordUser,
  forgetPasswordUser,
  getMyProfile,
  loginUser,
  registerUser,
  setNewPasswordUser,
  updateMyProfile,
  verificationCodeUser,
} from './user.controller'
import { verifyCodeTokenMiddleware } from '../../middlewares/verifyCodeTokenMiddleware'
import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { userProfileImageUpload } from '../../middlewares/userProfileImageUpload'

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

userRoutes.get('/get-my-profile', authenticateAdmin, getMyProfile)
userRoutes.patch(
  '/update-my-profile',
  authenticateAdmin,
  userProfileImageUpload.single('userProfileImage'),
  updateMyProfile
)

export default userRoutes
