import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'

import {
  createDailyReport,
  getAllDailyReportByAdmin,
  getAllDailyReportByStaff,
  getSingleDailyReportByAdmin,
  updateDailyReport,
} from './dailyReport.controller'
import { authenticateStaff } from '../../middlewares/staffWiseAccessMiddleware'
import { dailyReportUpload } from '../../middlewares/dailyReportUploads'

const dailyReportRoutes = express.Router()

dailyReportRoutes.post(
  '/create-daily-report',
  authenticateStaff,
  dailyReportUpload.fields([
    { name: 'issueOrDelaysImage', maxCount: 1 },
    { name: 'photoOrFileUploaded', maxCount: 1 },
    { name: 'expensesIncurredImage', maxCount: 1 },
  ]),
  createDailyReport
)

dailyReportRoutes.patch(
  '/update-daily-report/:reportId',
  authenticateAdmin,
  dailyReportUpload.fields([
    { name: 'issueOrDelaysImage', maxCount: 1 },
    { name: 'photoOrFileUploaded', maxCount: 1 },
    { name: 'expensesIncurredImage', maxCount: 1 },
  ]),
  updateDailyReport
)

dailyReportRoutes.get(
  '/get-single-daily-report-by-admin/:reportId',
  authenticateAdmin,
  getSingleDailyReportByAdmin
)

dailyReportRoutes.get(
  '/get-all-daily-report-by-admin',
  authenticateAdmin,
  getAllDailyReportByAdmin
)

dailyReportRoutes.get(
  '/get-all-daily-report-by-staff',
  authenticateStaff,
  getAllDailyReportByStaff
)

export default dailyReportRoutes
