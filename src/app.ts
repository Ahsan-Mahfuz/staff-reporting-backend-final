import express from 'express'
import cors from 'cors'
import userRoutes from './modules/user/user.routes'
import clientRoutes from './modules/client/client.routes'
import staffRoutes from './modules/staff/staff.routes'
import officeNoticeRoutes from './modules/officeNotice/officeNotice.routes'
import officeTimeRoutes from './modules/officeTime/officeTime.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/picture', express.static('picture'))

app.use('/user', userRoutes)
app.use('/client', clientRoutes)
app.use('/staff', staffRoutes)
app.use('/office', officeNoticeRoutes)
app.use('/office-time', officeTimeRoutes)

export default app
