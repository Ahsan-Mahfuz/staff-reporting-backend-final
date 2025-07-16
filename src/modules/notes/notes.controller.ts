import { Request, Response } from 'express'
import { NotesModel } from './notes.model'
import { StaffModel } from '../staff/staff.model'

export const createNote = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }
    const { staffId } = req.params
    const { desc } = req.body

    if (!staffId) {
      res.status(400).json({ success: false, message: 'Staff ID is required' })
      return
    }

    const findStaff = await StaffModel.findOne({
      _id: staffId,
      createdBy: userId,
    })

    if (!findStaff) {
      res.status(404).json({ success: false, message: 'Staff not found' })
      return
    }

    const newNote = new NotesModel({
      desc,
      staffId,
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

export const getAllNoteByStaffId = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const { staffId } = req.params

    if (!staffId) {
      res.status(400).json({ success: false, message: 'Staff ID is required' })
      return
    }

    const findStaff = await StaffModel.findOne({
      _id: staffId,
      createdBy: userId,
    })

    if (!findStaff) {
      res.status(404).json({ success: false, message: 'Staff not found' })
      return
    }

    const notes = await NotesModel.find({ staffId, createdBy: userId }).sort({
      createdAt: -1,
    })

    res
      .status(200)
      .json({ message: 'Staff note fetched successfully', data: notes })
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message })
  }
}

export const deleteNoteStaffId = async (req: Request, res: Response) => {
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

    const findNote = await NotesModel.findOne({
      createdBy: userId,
      _id: notesId,
    })

    if (!findNote) {
      res.status(404).json({ success: false, message: 'Not found this note' })
      return
    }

    await NotesModel.findOneAndDelete({
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

export const getSingleNoteByStaffId = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const { staffId } = req.params
    const { notesId } = req.query

    if (!notesId) {
      res.status(400).json({ success: false, message: 'Notes ID is required' })
      return
    }

    if (!staffId) {
      res.status(400).json({ success: false, message: 'Staff ID is required' })
      return
    }

    const findStaff = await StaffModel.findOne({
      _id: staffId,
      createdBy: userId,
    })

    if (!findStaff) {
      res.status(404).json({ success: false, message: 'Staff not found' })
      return
    }

    const notes = await NotesModel.findOne({
      staffId,
      createdBy: userId,
      _id: notesId,
    })

    if (!notes) {
      res.status(404).json({ success: false, message: 'Not found this note' })
      return
    }

    res
      .status(200)
      .json({ message: 'Staff note fetched successfully', data: notes })
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: 'Server Error', error: error.message })
  }
}
