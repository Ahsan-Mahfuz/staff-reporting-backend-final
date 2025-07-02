import { Request, Response, NextFunction } from 'express'
import { UserModel } from './user.model'
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
} from './user.validation'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { createToken } from '../../utils/jwt'

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
    const { email, password } = validatedData

    const existingUser = await UserModel.findOne({ email: email })
    if (!existingUser) {
      res.status(401).json({ message: 'The credentials are incorrect' })
      return
    }

    if (!(await bcrypt.compare(password, existingUser.password))) {
      res.status(401).json({ message: 'The credentials are incorrect' })
      return
    }

    const token = createToken({
      userId: existingUser._id,
      email: existingUser.email,
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

    const existingUser = await UserModel.findOne({ email: email })
    if (!existingUser) {
      res.status(401).json({ message: 'The email is not registered' })
      return
    }
    

    res.status(201).json({
      message: 'Code has been sent to your email',
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
