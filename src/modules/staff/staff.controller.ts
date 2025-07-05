import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { createStaffSchema } from './staff.validation'
import { StaffModel } from './staff.model'

export const createStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { staff } = req.body
    const parsedStaff = JSON.parse(staff)

    const staffImage = req.file?.mimetype || ''
    const validatedData = createStaffSchema.parse({
      ...parsedStaff,
      staffImage,
    })

    const generatedStaffId =
      parsedStaff.name.toLowerCase().replace(/\s+/g, '') +
      parsedStaff.phoneNumber

    const existingStaff = await StaffModel.findOne({
      staffId: generatedStaffId,
    })
    if (existingStaff) {
      res.status(409).json({
        message: 'Staff with this name and phone number already exists.',
      })
      return
    }

    const imageUrl = req.file
      ? `/picture/staff_image/${req.file.filename}`
      : null

    const adminId = (req as any).user?.userId

    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized. No admin ID found.' })
      return
    }

    const newStaff = new StaffModel({
      ...parsedStaff,
      staffId: generatedStaffId,
      staffImage: imageUrl,
      createdBy: adminId,
    })

    await newStaff.save()

    res.status(201).json({
      message: 'Staff created successfully',
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

export const editStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { staffId } = req.params
    const { staff } = req.body
    const parsedStaff = JSON.parse(staff)

    const staffImage = req.file?.mimetype || ''
    const validatedData = createStaffSchema.parse({
      ...parsedStaff,
      staffImage,
    })

    const adminId = (req as any).user?.userId

    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized. No admin ID found.' })
      return
    }

    const targetStaff = await StaffModel.findOne({
      _id: staffId,
      createdBy: adminId,
    })

    if (!targetStaff) {
      res.status(404).json({ message: 'Staff not found or access denied.' })
      return
    }

    const generatedStaffId =
      parsedStaff.name.toLowerCase().replace(/\s+/g, '') +
      parsedStaff.phoneNumber

    const duplicate = await StaffModel.findOne({
      staffId: generatedStaffId,
      _id: { $ne: staffId },
    })
    if (duplicate) {
      res.status(409).json({
        message:
          'Another staff with this name and phone number already exists.',
      })
      return
    }

    const imageUrl = req.file
      ? `/picture/staff_image/${req.file.filename}`
      : targetStaff.staffImage

    targetStaff.name = parsedStaff.name
    targetStaff.phoneNumber = parsedStaff.phoneNumber
    targetStaff.rates = parsedStaff.rates
    targetStaff.staffId = generatedStaffId
    targetStaff.staffImage = imageUrl

    await targetStaff.save()

    res.status(200).json({
      message: 'Client updated successfully',
      data: targetStaff,
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

export const getMyStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).user?.userId

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const { search } = req.query

    let filter: any = { createdBy: adminId }

    if (search && typeof search === 'string') {
      const regex = new RegExp(search, 'i')
      filter.$or = [{ name: regex }, { phoneNumber: regex }, { staffId: regex }]
    }

    const totalStaff = await StaffModel.countDocuments(filter)

    const staffs = await StaffModel.find(filter).skip(skip).limit(limit)

    res.status(200).json({
      message: 'Staff fetched successfully',
      data: staffs,
      pagination: {
        total: totalStaff,
        page,
        limit,
        pages: Math.ceil(totalStaff / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getSingleStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).user?.userId
    const { staffId } = req.params

    const staff = await StaffModel.findOne({
      _id: staffId,
      createdBy: adminId,
    })

    if (!staff) {
      res.status(404).json({
        message: 'Client not found or access denied',
      })
      return
    }

    res.status(200).json({
      message: 'Staff fetched successfully',
      data: staff,
    })
  } catch (error) {
    next(error)
  }
}

export const blockUnblockStaff = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).user?.userId

    const { staffId } = req.params

    const staff = await StaffModel.findOne({
      _id: staffId,
      createdBy: adminId,
    })

    if (!staff) {
      res.status(404).json({
        message: 'Staff not found or access denied',
      })
      return
    }

    staff.isBlocked = !staff.isBlocked
    await staff.save()

    res.status(200).json({
      message: staff.isBlocked
        ? 'Staff blocked successfully'
        : 'Staff unblocked successfully',
    })
  } catch (error) {
    next(error)
  }
}
