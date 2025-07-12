import { Request, Response } from 'express'
import { CalenderModel } from './calender.model'
import { UserModel } from '../user/user.model'

export const getAllCalenders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId
    const email = (req as any).user?.email

    if (!userId || !email) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { month, year } = req.query

    if (!month || !year) {
      res.status(400).json({
        success: false,
        message:
          'Month and Year are required (e.g. /calenders?month=7&year=2025)',
      })
      return
    }

    const m = parseInt(month as string) - 1
    const y = parseInt(year as string)

    const startOfMonth = new Date(y, m, 1, 0, 0, 0, 0)
    const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59, 999)

    const filter: any = {
      createdBy: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    }

    const data = await CalenderModel.find(filter).populate('staffId')

    res.status(200).json({ success: true, data })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error })
  }
}

export const updateCalender = async (req: Request, res: Response) => {
  try {
    const { calenderId } = req.params
    const userId = (req as any).user?.userId
    const email = (req as any).user?.email

    if (!userId || !email) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const user = await UserModel.findOne({ email })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    if (!calenderId) {
      res
        .status(400)
        .json({ success: false, message: 'Calender ID is required' })
      return
    }

    const calender = await CalenderModel.findById(calenderId)
    if (!calender) {
      res.status(404).json({ success: false, message: 'Calender not found' })
      return
    }

    const { color } = req.body

    if (color && !/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      res.status(400).json({ success: false, message: 'Invalid hex color' })
      return
    }

    calender.color = color
    await calender.save()

    res.status(200).json({ success: true, message: 'Calender updated' })
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message })
  }
}
