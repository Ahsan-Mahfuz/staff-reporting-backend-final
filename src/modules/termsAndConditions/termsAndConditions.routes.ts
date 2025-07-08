import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import {
  getTermsAndConditions,
  updatedTermsAndConditions,
} from './termsAndConditions.controller'

const termsAndConditionsRoutes = express.Router()

termsAndConditionsRoutes.patch(
  '/update-terms-and-conditions',
  authenticateAdmin,
  updatedTermsAndConditions
)

termsAndConditionsRoutes.get(
  '/get-terms-and-conditions',
  authenticateAdmin,
  getTermsAndConditions
)

export default termsAndConditionsRoutes
