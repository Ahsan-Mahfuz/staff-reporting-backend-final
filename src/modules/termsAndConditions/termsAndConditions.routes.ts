import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import {
  getTermsAndConditions,
  updatedTermsAndConditions,
} from './termsAndConditions.controller'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'

const termsAndConditionsRoutes = express.Router()

termsAndConditionsRoutes.patch(
  '/update-terms-and-conditions',
  authenticateAdmin,
  updatedTermsAndConditions
)

termsAndConditionsRoutes.get(
  '/get-terms-and-conditions',
  authenticateStaff,
  getTermsAndConditions
)

export default termsAndConditionsRoutes
