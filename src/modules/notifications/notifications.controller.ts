import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../user/user.model'
import { NotificationModel } from './notifications.model'
import { StaffModel } from '../staff/staff.model'

export const getAllNotificationsByAdmin = async (
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

    const filter = {
      sendTo: 'admin',
      createdBy: userId,
    }

    const [notifications, total] = await Promise.all([
      NotificationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NotificationModel.countDocuments(filter),
    ])

    res.status(200).json({
      message: 'Notifications fetched successfully',
      data: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getAllNotificationsByStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId
    const staffId = (req as any).user?.staffId

    if (!userId) {
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

    const filter = {
      staffId,
      sendTo: 'staff',
      createdBy: userId,
    }

    const [notifications, total] = await Promise.all([
      NotificationModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NotificationModel.countDocuments(filter),
    ])

    res.status(200).json({
      message: 'Notifications fetched successfully',
      data: notifications,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const notificationMarkAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.params
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    await NotificationModel.findByIdAndUpdate(notificationId, {
      status: 'read',
    })

    res.status(200).json({
      message: 'Notifications mark as read successfully',
    })
  } catch (error) {
    next(error)
  }
}
