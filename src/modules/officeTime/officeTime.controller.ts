import { Request, Response, NextFunction } from 'express'
import { OfficeTimeTableModel } from './officeTime.model'

export const createOfficeTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { checkInTime, checkOutTime } = req.body
    const createdBy = (req as any).user?.userId

    if (!checkInTime || !checkOutTime) {
      res
        .status(400)
        .json({ message: 'Check-in and Check-out time are required' })
      return
    }

    const existingTimeTable = await OfficeTimeTableModel.findOne({ createdBy })

    if (existingTimeTable) {
      existingTimeTable.checkInTime = checkInTime
      existingTimeTable.checkOutTime = checkOutTime
      await existingTimeTable.save()

      res.status(200).json({
        message: 'Office time table updated successfully',
        data: existingTimeTable,
      })
      return
    }

    const newTimeTable = await OfficeTimeTableModel.create({
      checkInTime,
      checkOutTime,
      createdBy,
    })

    res.status(201).json({
      message: 'Office time table updated successfully',
      data: newTimeTable,
    })
  } catch (error) {
    next(error)
  }
}

export const getMyOfficeTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const timeTable = await OfficeTimeTableModel.find({ createdBy: userId })

    res.status(200).json({
      message: 'Office time table fetched successfully',
      data: timeTable,
    })
  } catch (error) {
    next(error)
  }
}
