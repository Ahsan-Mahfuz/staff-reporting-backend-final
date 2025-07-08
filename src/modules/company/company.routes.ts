import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { uploadCompanyLogo } from '../../middlewares/companyUpload'
import { createCompany, getCompany } from './company.controller'

const companyRoutes = express.Router()

companyRoutes.patch(
  '/create-company-logo-color',
  authenticateAdmin,
  uploadCompanyLogo.single('companyLogo'),
  createCompany
)

companyRoutes.get('/get-company-logo-color', authenticateAdmin, getCompany)

export default companyRoutes
