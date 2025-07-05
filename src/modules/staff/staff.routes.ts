import express from 'express'
import {
  blockUnblockStaff,
  createStaff,
  editStaff,
  getMyStaff,
  getSingleStaff,
} from './staff.controller'
import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { uploadStaff } from '../../middlewares/uploadStaff'

const staffRoutes = express.Router()

staffRoutes.post(
  '/create-staff',
  authenticateAdmin,
  uploadStaff.single('staffImage'),
  createStaff
)

staffRoutes.get('/get-all-my-staffs', authenticateAdmin, getMyStaff)

staffRoutes.patch(
  '/update-staff/:staffId',
  authenticateAdmin,
  uploadStaff.single('staffImage'),
  editStaff
)

staffRoutes.get('/get-single-staff/:staffId', authenticateAdmin, getSingleStaff)

staffRoutes.patch(
  '/block-unblock-staff/:staffId',
  authenticateAdmin,
  blockUnblockStaff
)

export default staffRoutes
