import { Request, Response } from 'express'
import { NotesClientModel } from './notes.model'
import { ClientModel } from '../client/client.model'

export const createNoteClient = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }
    const { clientId } = req.params
    const { desc } = req.body

    if (!clientId) {
      res.status(400).json({ success: false, message: 'Staff ID is required' })
      return
    }

    const findStaff = await ClientModel.findOne({
      _id: clientId,
      createdBy: userId,
    })

    if (!findStaff) {
      res.status(404).json({ success: false, message: 'Client not found' })
      return
    }

    const newNote = new NotesClientModel({
      desc,
      clientId,
      createdBy: userId,
    })

    await newNote.save()

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: newNote,
    })
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message })
  }
}

export const getAllNoteByClientId = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const { clientId } = req.params

    if (!clientId) {
      res.status(400).json({ success: false, message: 'Staff ID is required' })
      return
    }

    const findStaff = await ClientModel.findOne({
      _id: clientId,
      createdBy: userId,
    })

    if (!findStaff) {
      res.status(404).json({ success: false, message: 'Client not found' })
      return
    }

    const notes = await NotesClientModel.find({
      clientId,
      createdBy: userId,
    }).sort({
      createdAt: -1,
    })

    res
      .status(200)
      .json({ message: 'Client note fetched successfully', data: notes })
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message })
  }
}

export const deleteNoteClientId = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const { notesId } = req.params

    if (!notesId) {
      res.status(400).json({ success: false, message: 'Notes ID is required' })
      return
    }

    const findNote = await NotesClientModel.findOne({
      createdBy: userId,
      _id: notesId,
    })

    if (!findNote) {
      res.status(404).json({ success: false, message: 'Not found this note' })
      return
    }

    await NotesClientModel.findOneAndDelete({
      _id: notesId,
      createdBy: userId,
    })

    res.status(200).json({ message: 'Note deleted successfully' })
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message })
  }
}

export const getSingleNoteByClientId = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const { clientId } = req.params
    const { notesId } = req.query

    if (!notesId) {
      res.status(400).json({ success: false, message: 'Notes ID is required' })
      return
    }

    if (!clientId) {
      res.status(400).json({ success: false, message: 'Client ID is required' })
      return
    }

    const findStaff = await ClientModel.findOne({
      _id: clientId,
      createdBy: userId,
    })

    if (!findStaff) {
      res.status(404).json({ success: false, message: 'Client not found' })
      return
    }

    const notes = await NotesClientModel.findOne({
      clientId,
      createdBy: userId,
      _id: notesId,
    })

    if (!notes) {
      res.status(404).json({ success: false, message: 'Not found this note' })
      return
    }

    res
      .status(200)
      .json({ message: 'Client note fetched successfully', data: notes })
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message })
  }
}
