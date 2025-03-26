/**
 * Represents a note in the system
 */
export interface Note {
  /** Unique identifier for the note */
  id: string

  /** Title of the note */
  title: string

  /** Content of the note */
  content: string

  /** Timestamp when the note was created */
  createdAt: Date
}

/**
 * Schema for creating a new note
 */
export interface CreateNoteInput {
  title: string
  content: string
}

/**
 * Schema for retrieving a note
 */
export interface GetNoteInput {
  id: string
}
