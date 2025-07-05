import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'

const officeNoticeRoutes = express.Router()

officeNoticeRoutes.post(
  '/create-client',
  authenticateAdmin,
  upload.single('officeNotice'),
  createClient
)

officeNoticeRoutes.get('/get-all-my-clients', authenticateAdmin, getMyClients)

officeNoticeRoutes.delete(
  '/block-unblock-client/:clientId',
  authenticateAdmin,
  blockUnblockClients
)

export default clientRoutes
