import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { getAllCalenders, updateCalender } from './calender.controller'

const calenderRoutes = express.Router()

calenderRoutes.get(
  '/get-calender-data',
  authenticateAdmin,
  getAllCalenders
)
calenderRoutes.patch(
  '/update-calender-color/:calenderId',
  authenticateAdmin,
  updateCalender
)

export default calenderRoutes
