import express from 'express'
import {
  createClient,
  getMyClients,
  getSingleClient,
} from './client.controller'
import { upload } from '../../middlewares/upload'
import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'

const clientRoutes = express.Router()

clientRoutes.post(
  '/create-client',
  authenticateAdmin,
  upload.single('clientImage'),
  createClient
)
clientRoutes.post('/get-all-my-clients', authenticateAdmin, getMyClients)
clientRoutes.get('/get-single-client/:clientId', authenticateAdmin, getSingleClient)

export default clientRoutes
