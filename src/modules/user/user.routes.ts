import express from 'express'
import { loginUser, registerUser } from './user.controller'

const userRoutes = express.Router()

userRoutes.post('/register', registerUser)
userRoutes.post('/signin', loginUser)

export default userRoutes
