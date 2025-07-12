import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'
import {
  getAllNotificationsByAdmin,
  getAllNotificationsByStaff,
  notificationMarkAsRead,
} from './notifications.controller'

const notificationsRoutes = express.Router()

notificationsRoutes.get(
  '/get-all-notification-by-staff',
  authenticateStaff,
  getAllNotificationsByStaff
)
notificationsRoutes.get(
  '/get-all-notification-by-admin',
  authenticateAdmin,
  getAllNotificationsByAdmin
)
notificationsRoutes.patch(
  '/notifications-mark-as-read/:notificationId',
  authenticateAdmin,
  notificationMarkAsRead
)

export default notificationsRoutes
