import { Request, Response, NextFunction } from 'express'
import { UserModel } from './user.model'
import {
  changePasswordSchema,
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  setNewPasswordSchema,
  verificationCodeSchema,
} from './user.validation'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { createToken } from '../../utils/jwt'
import nodemailer from 'nodemailer'
import { CustomRequest } from './user.types'

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = registerSchema.parse(req.body)
    const { name, email, password } = validatedData

    const existingUser = await UserModel.findOne({ email: validatedData.email })
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' })
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    })

    const token = createToken({
      userId: newUser._id,
      email: newUser.email,
      name: newUser.name,
      bgColor: newUser.color,
      role: 'admin',
    })

    res.status(201).json({
      message: 'You have successfully signed up',
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = loginSchema.parse(req.body)
    const { email, password, role } = validatedData

    const existingUser = await UserModel.findOne({ email: email })
    if (!existingUser) {
      res.status(401).json({ message: 'The credentials are incorrect' })
      return
    }

    if (!(await bcrypt.compare(password, existingUser.password))) {
      res.status(401).json({ message: 'The credentials are incorrect' })
      return
    }

    if (existingUser.role === 'admin' && role === 'superadmin') {
      res.status(401).json({
        message:
          'You are not authorized to log in as a super-admin. Please log in as an admin.',
      })
      return
    }

    const token = createToken({
      userId: existingUser._id,
      email: existingUser.email,
      name: existingUser.name,
      bgColor: existingUser.color,
      role: role || 'admin',
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

export const forgetPasswordUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = forgetPasswordSchema.parse(req.body)
    const { email } = validatedData

    const existingUser = await UserModel.findOne({ email })
    if (!existingUser) {
      res.status(401).json({ message: 'The email is not registered' })
      return
    }

    const resetCode = Math.floor(10000 + Math.random() * 90000)

    existingUser.resetCode = resetCode
    existingUser.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000)
    console.log(existingUser.resetCodeExpires)
    await existingUser.save()

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"Staff Reporting" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Staff Reporting Password Reset Code',

      text: `Your staff reporting password reset code is: ${resetCode}\n\nPlease use this code within 10 minutes.`,
      html: `
    <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); overflow: hidden;">
        <div style="background-color: #FEF6F6; padding: 20px; text-align: center;">
          <h2 style="color: #000000; margin: 0;">Staff Reporting</h2>
        </div>
        <div style="padding: 30px;">
          <h3 style="margin-top: 0;">Password Reset Code</h3>
          <p>Hello,</p>
          <p>You requested a password reset. Please use the following code to proceed:</p>
          <div style="font-size: 24px; font-weight: bold; background-color: #f0f4f8; padding: 15px; text-align: center; border-radius: 6px; letter-spacing: 2px; margin: 20px 0;">
            ${resetCode}
          </div>
          <p>This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p style="margin-top: 30px;">Thanks,<br>The Staff Reporting Team</p>
        </div>
        <div style="background-color: #f0f0f0; text-align: center; font-size: 12px; color: #777; padding: 15px;">
          © ${new Date().getFullYear()} Staff Reporting. All rights reserved.
        </div>
      </div>
    </div>
  `,
    }

    await transporter.sendMail(mailOptions)

    res.status(201).json({
      message: 'Reset code has been sent to your email',
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

export const verificationCodeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = verificationCodeSchema.parse(req.body)
    const { email, code } = validatedData

    const user = await UserModel.findOne({ email })

    if (!user || !user.resetCode || !user.resetCodeExpires) {
      res.status(400).json({ message: 'Invalid request' })
      return
    }

    if (user.resetCode !== code) {
      res.status(400).json({ message: 'Invalid reset code' })
      return
    }

    if (new Date(user.resetCodeExpires) < new Date()) {
      res.status(400).json({ message: 'Reset code expired' })
      return
    }
    const token = createToken({
      userId: user._id,
      email: user.email,
      code: code,
    })

    res.status(200).json({
      message: 'Code verified successfully',
      verify_code_token: token,
    })

    user.resetCode = null
    user.resetCodeExpires = null
    await user.save()
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

export const setNewPasswordUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = setNewPasswordSchema.parse(req.body)
    const { newPassword } = validatedData

    const email = req.user?.email

    if (!email) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const existingUser = await UserModel.findOne({ email })
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    existingUser.password = hashedPassword
    await existingUser.save()

    const token = createToken({
      userId: existingUser._id,
      email: email,
      name: existingUser.name,
    })

    res.status(200).json({
      message: 'Password has been updated successfully',
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

export const changePasswordUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body)
    const { currentPassword, newPassword } = validatedData

    const userId = req.user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const existingUser = await UserModel.findOne({ _id: userId })
    if (!existingUser) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      existingUser.password
    )
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid current password' })
      return
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    existingUser.password = hashedPassword
    await existingUser.save()

    res.status(200).json({
      message: 'Password has been changed successfully',
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

export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized Access' })
      return
    }

    const user = await UserModel.findById(userId).select(
      'name email profileImage'
    )

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res
      .status(200)
      .json({ message: 'User profile fetched successfully', data: user })
  } catch (error) {
    next(error)
  }
}

export const updateMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized Access' })
      return
    }

    const { name } = req.body
    const profileImage = req.file
      ? `/picture/user_profile_image/${req.file.filename}`
      : null

    const updatedFields: Partial<{ name: string; profileImage: string }> = {}
    if (name) updatedFields.name = name
    if (profileImage) updatedFields.profileImage = profileImage

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).select('name email profileImage')

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res
      .status(200)
      .json({ message: 'User profile updated successfully', data: updatedUser })
  } catch (error) {
    next(error)
  }
}
