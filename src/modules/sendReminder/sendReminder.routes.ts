import express from 'express'
import {
  createSendReminder,
  getStaffReminderById,
} from './sendReminder.controller'
import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { uploadStaff } from '../../middlewares/uploadStaff'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'

const sendReminderRoutes = express.Router()

sendReminderRoutes.post(
  '/send-reminder/:staffId',
  authenticateAdmin,
  uploadStaff.single('file'),
  createSendReminder
)

sendReminderRoutes.get(
  '/get-reminder/:reminderId',
  authenticateStaff,
  getStaffReminderById
)

export default sendReminderRoutes
