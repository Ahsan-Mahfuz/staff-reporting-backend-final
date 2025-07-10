import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import {
  getPrivacyPolicy,
  updatedPrivacyPolicy,
} from './privacyPolicy.controller'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'

const privacyPolicyRoutes = express.Router()

privacyPolicyRoutes.patch(
  '/update-privacy-policy',
  authenticateAdmin,
  updatedPrivacyPolicy
)

privacyPolicyRoutes.get(
  '/get-privacy-policy',
  authenticateStaff,
  getPrivacyPolicy
)

export default privacyPolicyRoutes
