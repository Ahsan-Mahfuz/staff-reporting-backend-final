import express from 'express'
import cors from 'cors'
import userRoutes from './modules/user/user.route'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/v1/users', userRoutes)

export default app
