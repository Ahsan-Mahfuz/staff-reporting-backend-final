import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { uploadStaff } from '../../middlewares/uploadStaff'
import { loginStaffAuth } from './staff_auth.controller'

const staffAuthRoutes = express.Router()

staffAuthRoutes.post('/login-staff', loginStaffAuth)

// staffAuthRoutes.get('/get-all-my-staffs', authenticateAdmin, getMyStaff)

export default staffAuthRoutes
