import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { createOfficeTime, getMyOfficeTime } from './officeTime.controller'

const officeTimeRoutes = express.Router()

officeTimeRoutes.post(
  '/create-office-time',
  authenticateAdmin,
  createOfficeTime
)

officeTimeRoutes.get('/get-office-time', authenticateAdmin, getMyOfficeTime)

export default officeTimeRoutes
