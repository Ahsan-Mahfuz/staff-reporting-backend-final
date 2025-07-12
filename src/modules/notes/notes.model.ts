import { Schema, Types, model } from 'mongoose'

interface INotes {
  desc?: string | null
  staffId: Types.ObjectId
  createdBy: Types.ObjectId
}

const notesSchema = new Schema<INotes>(
  {
    desc: {
      type: String,
      required: false,
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: 'Staff',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const NotesModel = model<INotes>('Notes', notesSchema)
