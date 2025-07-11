import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'

import {
  createDailyReport,
  updateDailyReport,
  //   getAllDailyReports,
  //   getSingleDailyReport,
  //   updateDailyReport,
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
// dailyReportRoutes.get(
//   '/get-single-daily-report/:reportId',
//   authenticateAdmin,
//   getSingleDailyReport
// )
// dailyReportRoutes.get(
//   '/get-all-daily-report/:reportId',
//   authenticateAdmin,
//   getAllDailyReports
// )
// dailyReportRoutes.get(
//   '/get-my-daily-report/:reportId',
//   authenticateAdmin,
//   getAllDailyReports
// )

export default dailyReportRoutes
