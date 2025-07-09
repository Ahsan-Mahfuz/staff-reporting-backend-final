import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'

interface JwtPayload {
  staffId: string
  companyId: string
  staffName: string
  staffPhoneNumber: string
}

export const authenticateStaff = (
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
    ;(req as any).user = {
      staffId: decoded.staffId,
      companyId: decoded.companyId,
      staffName: decoded.staffName,
      staffPhoneNumber: decoded.staffPhoneNumber,
    }
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
