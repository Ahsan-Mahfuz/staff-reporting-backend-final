import { Request, Response, NextFunction } from 'express'
import { DailyReportModel } from './dailyReport.model'
import {
  createDailyReportZod,
  updateDailyReportZod,
} from './dailyReport.validation'
import { z } from 'zod'
import { StaffModel } from '../staff/staff.model'
import { UserModel } from '../user/user.model'
import { NotificationModel } from '../notifications/notifications.model'
import { CalenderModel } from '../calender/calender.model'

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

    console.log("validatedData", validatedData);

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

    console.log("existingReport", existingReport);

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

    if (existingReport) {
      const updatedReport = await DailyReportModel.findByIdAndUpdate(
        existingReport._id,
        { $set: validatedData },
        { new: true }
      )
      res.status(200).json({
        message: 'Daily report updated successfully',
        data: updatedReport,
      })
    } else {
      const newReport = await DailyReportModel.create(validatedData)
      res.status(201).json({
        message: 'Daily report created successfully',
        data: newReport,
      })
    }

    const user = await StaffModel.findOne({ _id: staffId })
    await NotificationModel.create({
      createdBy,
      staffId,
      date: new Date(),
      status: 'unread',
      officeNotice: `New daily report submitted by Staff Name: ${user?.name}`,
      sendTo: 'admin',
    })
    await CalenderModel.create({
      createdBy,
      staffId,
      date: new Date(),
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

    if (
      existingReport.status !== validatedData.status &&
      ['Approved', 'Declined'].includes(validatedData.status ?? '')
    ) {
      await NotificationModel.create({
        createdBy: userId,
        staffId: existingReport.jobNumber,
        date: new Date(),
        status: 'unread',
        officeNotice: `Your expense on ${existingReport.date.toLocaleDateString()} has been ${
          validatedData.status?.toLowerCase() ?? 'updated'
        }`,
        sendTo: 'staff',
      })
    }

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

export const getSingleDailyReportByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { reportId } = req.params
    const userId = (req as any).user?.userId
    const email = (req as any).user?.email

    if (!userId && !email) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const report = await DailyReportModel.findOne({
      _id: reportId,
      createdBy: userId,
    })
      .populate(
        'staffRef',
        '_id name staffId staffImage designation isBlocked password rates'
      )
      .lean()

    if (!report) {
      res.status(404).json({ message: 'Report not found' })
      return
    }

    res.status(200).json({
      message: 'Report fetched successfully',
      data: {
        ...report,
      },
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

export const getAllDailyReportByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId
    const email = (req as any).user?.email

    if (!userId && !email) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const { date, month, week, search } = req.query

    const filter: any = {
      createdBy: userId,
    }

    if (date) {
      const targetDate = new Date(date as string)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      filter.date = { $gte: startOfDay, $lte: endOfDay }
    } else if (month) {
      const year = new Date().getFullYear()
      const firstDay = new Date(`${year}-${month}-01`)
      const lastDay = new Date(
        firstDay.getFullYear(),
        firstDay.getMonth() + 1,
        0
      )
      filter.date = { $gte: firstDay, $lte: lastDay }
    } else if (week) {
      const currentDate = new Date()
      const first = currentDate.getDate() - currentDate.getDay()
      const last = first + 6
      const firstDay = new Date(currentDate.setDate(first))
      const lastDay = new Date(currentDate.setDate(last))
      filter.date = { $gte: firstDay, $lte: lastDay }
    }

    const reports = await DailyReportModel.find(filter)
      .populate({
        path: 'staffRef',
        select:
          '_id name staffId staffImage designation isBlocked password rates',
      })
      .skip(skip)
      .limit(limit)
      .lean()

    const filteredReports = reports.filter((report) => {
      if (!search || !report.staffRef) return true

      const searchVal = (search as string).toLowerCase()
      const { name, staffId, designation }: any = report.staffRef

      return (
        name?.toLowerCase().includes(searchVal) ||
        staffId?.toLowerCase().includes(searchVal) ||
        designation?.toLowerCase().includes(searchVal)
      )
    })

    const formattedReports = filteredReports.map((report) => {
      const checkIn = report.checkInTime ? parseTime(report.checkInTime) : 0
      const checkOut = report.checkOutTime ? parseTime(report.checkOutTime) : 0
      const breakTime = parseBreakTime(report.breakTime || '0')
      const totalMinutes = Math.max(checkOut - checkIn - breakTime, 0)

      return {
        ...report,
        totalWorkedTime: `${Math.floor(totalMinutes / 60)}h ${
          totalMinutes % 60
        }m`,
      }
    })

    const paginatedReports = formattedReports.slice(skip, skip + limit)

    res.status(200).json({
      message: 'Report fetched successfully',
      data: paginatedReports,
      pagination: {
        total: formattedReports.length,
        page,
        limit,
        totalPages: Math.ceil(formattedReports.length / limit),
      },
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

function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function parseBreakTime(breakTime: string): number {
  switch (breakTime) {
    case '30 minutes':
      return 30
    case '1 hour':
      return 60
    case '0':
    default:
      return 0
  }
}

export const getAllDailyReportByStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId
    const staffId = (req as any).user?.staffId

    if (!userId || !staffId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const user = await StaffModel.findOne({ _id: staffId })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const { date, month, week, year, search } = req.query

    const filter: any = {
      createdBy: userId,
      jobNumber: staffId,
    }

    if (date) {
      const targetDate = new Date(date as string)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      filter.date = { $gte: startOfDay, $lte: endOfDay }
    } else if (month) {
      const y = year ? parseInt(year as string) : new Date().getFullYear()
      const firstDay = new Date(`${y}-${month}-01`)
      const lastDay = new Date(
        firstDay.getFullYear(),
        firstDay.getMonth() + 1,
        0
      )
      filter.date = { $gte: firstDay, $lte: lastDay }
    } else if (week) {
      const currentDate = new Date()
      const currentDay = currentDate.getDay()
      const first =
        currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
      const last = first + 6
      const firstDay = new Date(currentDate.setDate(first))
      const lastDay = new Date(currentDate.setDate(last))
      filter.date = { $gte: firstDay, $lte: lastDay }
    } else if (year) {
      const y = parseInt(year as string)
      const startOfYear = new Date(`${y}-01-01`)
      const endOfYear = new Date(`${y}-12-31T23:59:59.999Z`)
      filter.date = { $gte: startOfYear, $lte: endOfYear }
    }

    const reports = await DailyReportModel.find(filter)
      .populate({
        path: 'staffRef',
        select:
          '_id name staffId staffImage designation isBlocked password rates',
      })
      .skip(skip)
      .limit(limit)
      .lean()

    const filteredReports = reports.filter((report) => {
      if (!search || !report.staffRef) return true

      const searchVal = (search as string).toLowerCase()
      const { name, staffId, designation }: any = report.staffRef

      return (
        name?.toLowerCase().includes(searchVal) ||
        staffId?.toLowerCase().includes(searchVal) ||
        designation?.toLowerCase().includes(searchVal)
      )
    })

    const formattedReports = filteredReports.map((report) => {
      const checkIn = report.checkInTime ? parseTime(report.checkInTime) : 0
      const checkOut = report.checkOutTime ? parseTime(report.checkOutTime) : 0
      const breakTime = parseBreakTime(report.breakTime || '0')
      const totalMinutes = Math.max(checkOut - checkIn - breakTime, 0)

      return {
        ...report,
        totalWorkedTime: `${Math.floor(totalMinutes / 60)}h ${
          totalMinutes % 60
        }m`,
      }
    })

    const paginatedReports = formattedReports.slice(skip, skip + limit)

    res.status(200).json({
      message: 'Report fetched successfully',
      data: paginatedReports,
      pagination: {
        total: formattedReports.length,
        page,
        limit,
        totalPages: Math.ceil(formattedReports.length / limit),
      },
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
    } else {
      next(error)
    }
  }
}

export const getAllDailyReportBySuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sId = (req as any).user?.userId
    const sEmail = (req as any).user?.email

    if (!sId || !sEmail) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const user = await UserModel.findOne({ email: sEmail, _id: sId })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { month, week } = req.query
    const filter: any = {}
    if (month === 'true') {
      const today = new Date()
      today.setUTCHours(23, 59, 59, 999)

      const startDate = new Date(today)
      startDate.setUTCDate(today.getUTCDate() - 30)
      startDate.setUTCHours(0, 0, 0, 0)

      filter.date = { $gte: startDate, $lte: today }
    } else if (week === 'true') {
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)

      const startDate = new Date(today)
      startDate.setUTCDate(today.getUTCDate() - 7)
      startDate.setUTCHours(0, 0, 0, 0)

      const endDate = new Date(today)
      endDate.setUTCDate(today.getUTCDate() - 1)
      endDate.setUTCHours(23, 59, 59, 999)

      filter.date = { $gte: startDate, $lte: endDate }
    }

    const reports = await DailyReportModel.find(filter)
      .populate({
        path: 'staffRef',
        select: '_id staffId rates designation',
      })
      .lean()

    const formattedReports = reports.map((report) => {
      const checkIn = report.checkInTime ? parseTime(report.checkInTime) : 0
      const checkOut = report.checkOutTime ? parseTime(report.checkOutTime) : 0
      const breakTime = parseBreakTime(report.breakTime || '0')
      const totalMinutes = Math.max(checkOut - checkIn - breakTime, 0)

      return {
        ...report,
        totalWorkedTime: `${Math.floor(totalMinutes / 60)}h ${
          totalMinutes % 60
        }m`,
      }
    })

    res.status(200).json({
      message: 'Report fetched successfully',
      data: formattedReports,
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
