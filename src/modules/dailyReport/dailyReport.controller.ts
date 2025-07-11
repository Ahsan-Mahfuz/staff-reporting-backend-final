import { Request, Response, NextFunction } from 'express'
import { DailyReportModel } from './dailyReport.model'
import {
  createDailyReportZod,
  updateDailyReportZod,
} from './dailyReport.validation'
import { z } from 'zod'
import { StaffModel } from '../staff/staff.model'

export const createDailyReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let additionalIdsRaw: string[] = []

    if (typeof req.body.additionalUserId === 'string') {
      additionalIdsRaw = req.body.additionalUserId
        .split(',')
        .map((id: string) => id.trim())
    } else if (Array.isArray(req.body.additionalUserId)) {
      additionalIdsRaw = req.body.additionalUserId.map((id: string) =>
        id.trim()
      )
    }

    req.body.additionalUserId = additionalIdsRaw

    const validatedData = createDailyReportZod.parse(req.body)

    const createdBy = (req as any).user?.userId
    const staffId = (req as any).user?.staffId

    if (!createdBy || !staffId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const existingReport = await DailyReportModel.findOne({
      staffRef: staffId,
      date: validatedData.date,
    })

    if (existingReport) {
      res.status(400).json({
        message: 'You have already created a report for today',
      })
      return
    }

    const files = req.files as {
      issueOrDelaysImage?: Express.Multer.File[]
      photoOrFileUploaded?: Express.Multer.File[]
      expensesIncurredImage?: Express.Multer.File[]
    }

    validatedData.issueOrDelaysImage = files?.issueOrDelaysImage?.[0]
      ? `/picture/daily_report/${files.issueOrDelaysImage[0].filename}`
      : undefined

    validatedData.photoOrFileUploaded = files?.photoOrFileUploaded?.[0]
      ? `/picture/daily_report/${files.photoOrFileUploaded[0].filename}`
      : undefined

    validatedData.expensesIncurredImage = files?.expensesIncurredImage?.[0]
      ? `/picture/daily_report/${files.expensesIncurredImage[0].filename}`
      : undefined

    const staffDocs = await StaffModel.find({
      staffId: { $in: additionalIdsRaw },
      createdBy,
    }).select('staffId')

    const validStaffIds = staffDocs.map((doc) => doc.staffId)

    const invalidStaffIds = additionalIdsRaw.filter(
      (id) => !validStaffIds.includes(id)
    )

    if (invalidStaffIds.length > 0) {
      res.status(400).json({
        message: 'Invalid additionalUserId(s) provided',
        errors: invalidStaffIds.map((id) => `${id} is not present in staff`),
      })
      return
    }

    validatedData.additionalUserId = validStaffIds
    validatedData.additionalUserId = validStaffIds as any
    validatedData.clientId = req.body.clientId
    validatedData.staffRef = staffId
    validatedData.jobNumber = staffId
    validatedData.createdBy = createdBy

    const newReport = await DailyReportModel.create(validatedData)

    res.status(201).json({
      message: 'Daily report created successfully',
      data: newReport,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation Error',
        errors: error.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      })
      return
    }

    next(error)
  }
}

export const updateDailyReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = req.params
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    let additionalIdsRaw: string[] = []

    if (typeof req.body.additionalUserId === 'string') {
      additionalIdsRaw = req.body.additionalUserId
        .split(',')
        .map((id: string) => id.trim())
    } else if (Array.isArray(req.body.additionalUserId)) {
      additionalIdsRaw = req.body.additionalUserId.map((id: string) =>
        id.trim()
      )
    }

    req.body.additionalUserId = additionalIdsRaw

    const validatedData = updateDailyReportZod.parse(req.body)

    const existingReport = await DailyReportModel.findOne({
      _id: reportId,
      createdBy: userId,
    })

    if (!existingReport) {
      res.status(403).json({
        message:
          'You are not allowed to update this report or report not found',
      })
      return
    }

    const staffDocs = await StaffModel.find({
      staffId: { $in: additionalIdsRaw },
      createdBy: userId,
    }).select('staffId')

    const validStaffIds = staffDocs.map((doc) => doc.staffId)

    const invalidStaffIds = additionalIdsRaw.filter(
      (id) => !validStaffIds.includes(id)
    )

    if (invalidStaffIds.length > 0) {
      res.status(400).json({
        message: 'Invalid additionalUserId(s) provided',
        errors: invalidStaffIds.map((id) => `${id} is not present in staff`),
      })
      return
    }

    validatedData.additionalUserId = validStaffIds

    const files = req.files as {
      issueOrDelaysImage?: Express.Multer.File[]
      photoOrFileUploaded?: Express.Multer.File[]
      expensesIncurredImage?: Express.Multer.File[]
    }

    validatedData.issueOrDelaysImage = files?.issueOrDelaysImage?.[0]
      ? `/picture/daily_report/${files.issueOrDelaysImage[0].filename}`
      : undefined

    validatedData.photoOrFileUploaded = files?.photoOrFileUploaded?.[0]
      ? `/picture/daily_report/${files.photoOrFileUploaded[0].filename}`
      : undefined

    validatedData.expensesIncurredImage = files?.expensesIncurredImage?.[0]
      ? `/picture/daily_report/${files.expensesIncurredImage[0].filename}`
      : undefined

    const updatedReport = await DailyReportModel.findByIdAndUpdate(
      reportId,
      validatedData,
      { new: true }
    )

    res.status(200).json({
      message: 'Daily report updated successfully',
      data: updatedReport,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation Error',
        errors: error.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      })
      return
    }

    next(error)
  }
}

// export const getSingleDailyReport = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { reportId } = req.params
//     const report = await DailyReportModel.findById(reportId)
//       .populate('clientName')
//       .populate('staffRef')
//       .populate('additionalUserId')

//     if (!report) {
//       res.status(404).json({ message: 'Report not found' })
//       return
//     }

//     res.status(200).json({ data: report })
//   } catch (error) {
//     next(error)
//   }
// }

// export const getAllDailyReports = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const reports = await DailyReportModel.find()
//       .populate('clientName')
//       .populate('staffRef')
//       .populate('additionalUserId')
//     res.status(200).json({ data: reports })
//   } catch (error) {
//     next(error)
//   }
// }
