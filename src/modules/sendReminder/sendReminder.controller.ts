import { Request, Response } from 'express'
import { SendReminderModel } from './sendReminder.model'
import { createSendReminderZod } from './sendReminder.validation'
import { NotificationModel } from '../notifications/notifications.model'

export const createSendReminder = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.params
    console.log(staffId)
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const parseResult = createSendReminderZod.safeParse(req.body)

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        errors: parseResult.error.errors.map((err) => err.message),
      })
      return
    }

    const { desc } = parseResult.data

    const imageUrl = req.file
      ? `/picture/staff_image/${req.file.filename}`
      : null

    const newReminder = new SendReminderModel({
      staffId,
      file: imageUrl,
      desc,
      createdBy: userId,
    })

    await NotificationModel.create({
      createdBy: userId,
      staffId,
      date: new Date(),
      status: 'unread',
      officeNotice: desc,
      reminderId: newReminder._id,
      sendTo: 'staff',
    })

    await newReminder.save()

    res.status(201).json({
      success: true,
      message: 'Reminder send successfully',
      data: newReminder,
    })
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message })
  }
}

export const getStaffReminderById = async (req: Request, res: Response) => {
  try {
    const staffId = (req as any).user?.staffId
    const { reminderId } = req.params

    console.log(reminderId)
    if (!staffId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    if (!reminderId) {
      res.status(400).json({ message: 'Reminder ID is required' })
      return
    }

    const reminder = await SendReminderModel.findOne({
      _id: reminderId,
      staffId: staffId,
    })

    if (!reminder) {
      res.status(404).json({ message: 'Reminder not found' })
      return
    }

    res
      .status(200)
      .json({ message: 'Successfully get the reminder', data: reminder })
  } catch (error: any) {
    console.error(error)
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message })
  }
}
