import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { staffLoginSchema } from './staff_auth.validation'
import { StaffAuthModel } from './staff_auth.model'
import bcrypt from 'bcrypt'
import { createToken } from '../../utils/jwt'
import { StaffModel } from '../staff/staff.model'

export const loginStaffAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = staffLoginSchema.parse(req.body)
    const { staffId, password } = validatedData

    const existingUser = await StaffModel.findOne({ staffId: staffId })

    if (!existingUser) {
      res.status(401).json({ message: 'The credentials are incorrect' })
      return
    }

    if (!(password == existingUser.password)) {
      res.status(401).json({ message: 'The credentials are incorrect' })
      return
    }

    if (!existingUser.isBlocked) {
      res
        .status(401)
        .json({
          message:
            'You are blocked. Please contact admin to unblock your account.',
        })
      return
    }

    const token = createToken({
      staffId: existingUser._id,
      companyId: existingUser.createdBy,
      staffName: existingUser.name,
      staffPhoneNumber: existingUser.phoneNumber,
    })

    res.status(201).json({
      message: 'You have successfully signed in',
      token,
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
