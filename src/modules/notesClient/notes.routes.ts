import express from 'express'

import { authenticateAdmin } from '../../middlewares/userWiseAccessMiddleware'
import { createNoteClient, deleteNoteClientId, getAllNoteByClientId, getSingleNoteByClientId } from './notes.controller'


const notesClientRoutes = express.Router()

notesClientRoutes.post('/create-notes/:clientId', authenticateAdmin, createNoteClient)

notesClientRoutes.get(
  '/get-single-notes/:clientId',
  authenticateAdmin,
  getAllNoteByClientId
)
notesClientRoutes.delete('/delete-note/:notesId', authenticateAdmin, deleteNoteClientId)
notesClientRoutes.get('/get-single-one-get-note/:clientId', authenticateAdmin, getSingleNoteByClientId)

export default notesClientRoutes
