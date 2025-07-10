import express from 'express'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'
import {
  getAllStaffProfiles,
  getMyStaffProfile,
  getSingleStaffProfile,
  updateStaffProfile,
} from './staff_profile.controller'
import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { uploadStaffDetailsImages } from '../../middlewares/uploadStaffDetailsImages'

const staffProfileAuthRoutes = express.Router()

staffProfileAuthRoutes.patch(
  '/update-staff-info',
  authenticateStaff,
  uploadStaffDetailsImages.fields([
    { name: 'staffImage', maxCount: 1 },
    { name: 'qualification', maxCount: 1 },
  ]),
  updateStaffProfile
)
staffProfileAuthRoutes.get(
  '/get-all-staff-info',
  authenticateAdmin,
  getAllStaffProfiles
)
staffProfileAuthRoutes.get(
  '/get-single-staff-info/:staffId',
  authenticateAdmin,
  getSingleStaffProfile
)
staffProfileAuthRoutes.get(
  '/get-my-staff-profile/:staffId',
  authenticateStaff,
  getMyStaffProfile
)

export default staffProfileAuthRoutes
