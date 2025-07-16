import { Schema, Types, model } from 'mongoose'

interface INotesClient {
  desc?: string | null
  clientId: Types.ObjectId
  createdBy: Types.ObjectId
}

const notesClientSchema = new Schema<INotesClient>(
  {
    desc: {
      type: String,
      required: false,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

export const NotesClientModel = model<INotesClient>(
  'NotesClient',
  notesClientSchema
)
