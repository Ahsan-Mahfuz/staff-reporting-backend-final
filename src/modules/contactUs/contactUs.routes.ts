import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { getContactUs, updateContactUs } from './contactUs.controller'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'

const contactUsRoutes = express.Router()

contactUsRoutes.patch('/update-contact-us', authenticateAdmin, updateContactUs)

contactUsRoutes.get('/get-contact-us', authenticateStaff, getContactUs)

export default contactUsRoutes
