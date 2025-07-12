import express from 'express'
import cors from 'cors'
import userRoutes from './modules/user/user.routes'
import clientRoutes from './modules/client/client.routes'
import staffRoutes from './modules/staff/staff.routes'
import officeNoticeRoutes from './modules/officeNotice/officeNotice.routes'
import officeTimeRoutes from './modules/officeTime/officeTime.routes'
import companyRoutes from './modules/company/company.routes'
import aboutUsRoutes from './modules/aboutUs/aboutUs.routes'
import contactUsRoutes from './modules/contactUs/contactUs.routes'
import privacyPolicyRoutes from './modules/privacyPolicy/privacyPolicy.routes'
import termsAndConditionsRoutes from './modules/termsAndConditions/termsAndConditions.routes'
import staffAuthRoutes from './modules/staff_auth/staff_auth.routes'
import staffProfileAuthRoutes from './modules/staff_profile/staff_profile.routes'
import dailyReportRoutes from './modules/dailyReport/dailyReport.routes'
import notificationsRoutes from './modules/notifications/notifications.routes'
import calenderRoutes from './modules/calender/calender.routes'
import sendReminderRoutes from './modules/sendReminder/sendReminder.routes'
import notesRoutes from './modules/notes/notes.routes'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())

app.use('/picture', express.static('picture'))

app.use('/user', userRoutes)
app.use('/client', clientRoutes)
app.use('/staff', staffRoutes)
app.use('/office', officeNoticeRoutes)
app.use('/office-time', officeTimeRoutes)
app.use('/company', companyRoutes)
app.use('/company', aboutUsRoutes)
app.use('/company', contactUsRoutes)
app.use('/company', privacyPolicyRoutes)
app.use('/company', termsAndConditionsRoutes)
app.use('/staff', staffAuthRoutes)
app.use('/staff', staffProfileAuthRoutes)
app.use('/daily-report', dailyReportRoutes)
app.use('/notification', notificationsRoutes)
app.use('/calender', calenderRoutes)
app.use('/reminder', sendReminderRoutes)
app.use('/note', notesRoutes)

export default app
