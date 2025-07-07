import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { uploadOfficeNotice } from '../../middlewares/officeNoticeUpload'
import { createAOfficeNotice } from './officeNotice.controller'

const officeNoticeRoutes = express.Router()

officeNoticeRoutes.post(
  '/office-notice',
  authenticateAdmin,
  uploadOfficeNotice.single('officeNotice'),
  createAOfficeNotice
)

export default officeNoticeRoutes
