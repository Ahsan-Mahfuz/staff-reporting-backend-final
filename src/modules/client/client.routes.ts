import express from 'express'
import {
  blockUnblockClients,
  createClient,
  editClient,
  getMyClients,
  getSingleClient,
} from './client.controller'
import { upload } from '../../middlewares/upload'
import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'

const clientRoutes = express.Router()

clientRoutes.post(
  '/create-client',
  authenticateAdmin,
  upload.single('clientImage'),
  createClient
)
clientRoutes.patch(
  '/update-client/:clientId',
  authenticateAdmin,
  upload.single('clientImage'),
  editClient
)
clientRoutes.get('/get-all-my-clients', authenticateStaff, getMyClients)
clientRoutes.get(
  '/get-single-client/:clientId',
  authenticateAdmin,
  getSingleClient
)
clientRoutes.patch(
  '/block-unblock-client/:clientId',
  authenticateAdmin,
  blockUnblockClients
)

export default clientRoutes
