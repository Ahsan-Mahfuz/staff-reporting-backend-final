import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { uploadOfficeNotice } from '../../middlewares/officeNoticeUpload'
import {
  createAOfficeNotice,
  deleteOfficeNotice,
  getMyOfficeNotices,
} from './officeNotice.controller'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'

const officeNoticeRoutes = express.Router()

officeNoticeRoutes.post(
  '/office-notice',
  authenticateAdmin,
  uploadOfficeNotice.single('officeNotice'),
  createAOfficeNotice
)
officeNoticeRoutes.get(
  '/get-all-office-notice',
  authenticateStaff,
  getMyOfficeNotices
)
officeNoticeRoutes.delete(
  '/delete-office-notice/:id',
  authenticateAdmin,
  deleteOfficeNotice
)

export default officeNoticeRoutes
