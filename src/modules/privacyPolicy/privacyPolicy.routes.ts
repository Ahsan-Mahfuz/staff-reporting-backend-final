import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import {
  getPrivacyPolicy,
  updatedPrivacyPolicy,
} from './privacyPolicy.controller'

const privacyPolicyRoutes = express.Router()

privacyPolicyRoutes.patch(
  '/update-privacy-policy',
  authenticateAdmin,
  updatedPrivacyPolicy
)

privacyPolicyRoutes.get(
  '/get-privacy-policy',
  authenticateAdmin,
  getPrivacyPolicy
)

export default privacyPolicyRoutes
