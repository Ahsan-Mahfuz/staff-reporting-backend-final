import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadFolder = path.join(__dirname, '../../picture/daily_report')

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'issueOrDelaysImage') {
      cb(null, uploadFolder)
    } else if (file.fieldname === 'photoOrFiles') {
      cb(null, uploadFolder)
    } else if (file.fieldname === 'expensesIncurredImage') {
      cb(null, uploadFolder)
    } else {
      cb(null, uploadFolder)
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})
export const dailyReportUpload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ]
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only jpeg, jpg , png and pdf files are allowed'))
    }
    cb(null, true)
  },
})
