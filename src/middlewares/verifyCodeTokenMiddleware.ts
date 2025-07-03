import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { CustomRequest } from '../modules/user/user.types'

interface JwtPayload {
  userId: string
  email: string
  code: number
}

export const verifyCodeTokenMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      res
        .status(401)
        .json({ message: 'Authorization header missing or invalid' })
      return
    }

    const token = authHeader.split(' ')[1]

    const secret = config.jwt_secret

    const decoded = jwt.verify(token, secret) as JwtPayload

    req.user = {
      userId: decoded.userId,
      code: decoded.code,
      email: decoded.email,
    }

    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
    return
  }
}
