import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { createOfficeTime, getMyOfficeTime } from './officeTime.controller'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'

const officeTimeRoutes = express.Router()

officeTimeRoutes.post(
  '/create-office-time',
  authenticateAdmin,
  createOfficeTime
)

officeTimeRoutes.get('/get-office-time', authenticateStaff, getMyOfficeTime)

export default officeTimeRoutes
