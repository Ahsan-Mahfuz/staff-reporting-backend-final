import express from 'express'
import cors from 'cors'
import userRoutes from './modules/user/user.routes'


const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', userRoutes)

export default app

