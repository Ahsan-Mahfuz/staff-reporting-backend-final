import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import {
  createNote,
  deleteNoteStaffId,
  getAllNoteByStaffId,
} from './notes.controller'

const notesRoutes = express.Router()

notesRoutes.post('/create-notes/:staffId', authenticateAdmin, createNote)

notesRoutes.get(
  '/get-single-notes/:staffId',
  authenticateAdmin,
  getAllNoteByStaffId
)
notesRoutes.get('/delete-note/:notesId', authenticateAdmin, deleteNoteStaffId)

export default notesRoutes
