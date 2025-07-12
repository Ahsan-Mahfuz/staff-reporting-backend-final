import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'

interface JwtPayload {
  userId: string
  email: string
  name: string
  role: string
}

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, config.jwt_secret) as JwtPayload
    console.log(decoded)
    ;(req as any).user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
