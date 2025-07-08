import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { getContactUs, updateContactUs } from './contactUs.controller'

const contactUsRoutes = express.Router()

contactUsRoutes.patch('/update-contact-us', authenticateAdmin, updateContactUs)

contactUsRoutes.get('/get-contact-us', authenticateAdmin, getContactUs)

export default contactUsRoutes
