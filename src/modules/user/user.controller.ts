import { Request, Response } from 'express'
import { getAllUsers } from './user.service'

export const getUsers = (_req: Request, res: Response) => {
  const users = getAllUsers()
  res.json(users)
}
