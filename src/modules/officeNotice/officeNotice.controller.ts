import { NextFunction, Request, Response } from 'express'
import { createOfficeNoticeSchema } from './officeNotice.validation'
import { z } from 'zod'
import { OfficeNoticeModel } from './officeNotice.model'

export const createOfficeNotice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileType = req.file?.mimetype || ''
    const fileName = req.file?.filename || ''

    createOfficeNoticeSchema.parse({ file: fileType })

    const createdBy = (req as any).user?._id

    if (!createdBy) {
      return res.status(401).json({ message: 'Unauthorized access' })
    }

    const createdNotice = await OfficeNoticeModel.create({
      file: fileName,
      createdBy,
    })

    res.status(201).json({
      message: 'Office notice uploaded successfully',
      data: createdNotice,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((err) => err.message),
      })
      return
    }
    next(error)
  }
}

// export const getMyOfficeNotices = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = (req as any).user?._id

//     if (!userId) {
//       return res.status(401).json({ message: 'Unauthorized access' })
//     }

//     const notices = await OfficeNoticeModel.find({ createdBy: userId }).sort({
//       createdAt: -1,
//     })

//     res.status(200).json({
//       message: 'Office notices fetched successfully',
//       data: notices,
//     })
//   } catch (error) {
//     next(error)
//   }
// }



// export const deleteOfficeNotice = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = (req as any).user?._id
//     const noticeId = req.params.id

//     const notice = await OfficeNoticeModel.findById(noticeId)

//     if (!notice) {
//       return res.status(404).json({ message: 'Notice not found' })
//     }

//     if (notice.createdBy.toString() !== userId.toString()) {
//       return res.status(403).json({ message: 'Forbidden: Not your notice' })
//     }

//     await OfficeNoticeModel.findByIdAndDelete(noticeId)

//     res.status(200).json({ message: 'Office notice deleted successfully' })
//   } catch (error) {
//     next(error)
//   }
// }
