import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { getAboutUs, updateAboutUs } from './aboutUs.controller'

const aboutUsRoutes = express.Router()

aboutUsRoutes.patch('/update-about-us', authenticateAdmin, updateAboutUs)

aboutUsRoutes.get('/get-about-us', authenticateAdmin, getAboutUs)

export default aboutUsRoutes
