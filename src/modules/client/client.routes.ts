import express from 'express'
import { createClient } from './client.controller'
import { upload } from '../../middlewares/upload'
import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'

const clientRoutes = express.Router()

clientRoutes.post(
  '/create-client',
  authenticateAdmin,
  upload.single('clientImage'),
  createClient
)

export default clientRoutes
