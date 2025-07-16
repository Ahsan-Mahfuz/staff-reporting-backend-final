import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import {
  createNote,
  deleteNoteStaffId,
  getAllNoteByStaffId,
  getSingleNoteByStaffId,
} from './notes.controller'

const notesRoutes = express.Router()

notesRoutes.post('/create-notes/:staffId', authenticateAdmin, createNote)

notesRoutes.get(
  '/get-single-notes/:staffId',
  authenticateAdmin,
  getAllNoteByStaffId
)
notesRoutes.delete('/delete-note/:notesId', authenticateAdmin, deleteNoteStaffId)
notesRoutes.get('/get-single-one-get-note/:staffId', authenticateAdmin, getSingleNoteByStaffId)

export default notesRoutes
