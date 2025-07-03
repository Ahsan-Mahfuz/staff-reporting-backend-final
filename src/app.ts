import express from 'express'
import cors from 'cors'
import userRoutes from './modules/user/user.routes'
import path from 'path'
import clientRoutes from './modules/client/client.routes'

const app = express()

app.use(cors())
app.use(express.json())


app.use('/picture', express.static('picture'))

app.use('/user', userRoutes)
app.use('/client', clientRoutes)

export default app
