import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { NoteError } from '../errors/NoteError.js'
import { Note } from '../types/note.js'

// In-memory storage (would be a database in a real application)
const notes: Record<string, Note> = {}

/**
 * Generates a unique ID for a note
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

/**
 * Registers note-related tools with the MCP server
 */
export function registerNoteTools(server: McpServer): void {
  // Create Note Tool
  server.tool(
    'create_note',
    {
      title: z.string()
        .min(1, 'Title is required')
        .max(100, 'Title cannot exceed 100 characters')
        .trim(),
      content: z.string()
        .min(1, 'Content is required')
        .max(10000, 'Content cannot exceed 10000 characters')
        .trim()
    },
    async ({ title, content }) => {
      try {
        // Check for duplicate titles
        if (Object.values(notes).some(note => note.title === title)) {
          throw NoteError.duplicateTitle(title)
        }

        const id = generateId()
        const note: Note = {
          id,
          title,
          content,
          createdAt: new Date()
        }

        notes[id] = note

        return {
          content: [{
            type: 'text',
            text: `Note created with ID: ${id}`
          }]
        }
      } catch (error) {
        if (error instanceof NoteError) {
          return {
            content: [{
              type: 'text',
              text: `Error: ${error.message} (${error.code})`
            }]
          }
        }
        throw error
      }
    }
  )

  // List Notes Tool
  server.tool(
    'list_notes',
    {},
    async () => {
      try {
        const notesList = Object.values(notes)

        if (notesList.length === 0) {
          return {
            content: [{
              type: 'text',
              text: 'No notes found.'
            }]
          }
        }

        const formattedNotes = notesList
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .map(note =>
            `ID: ${note.id}\nTitle: ${note.title}\nCreated: ${note.createdAt.toISOString()}\n---\n`
          ).join('\n')

        return {
          content: [{
            type: 'text',
            text: `Available Notes:\n\n${formattedNotes}`
          }]
        }
      } catch (error) {
        console.error('Error listing notes:', error)
        return {
          content: [{
            type: 'text',
            text: 'Error: Failed to list notes'
          }]
        }
      }
    }
  )

  // Get Note Tool
  server.tool(
    'get_note',
    {
      id: z.string()
        .min(1, 'ID is required')
        .max(8, 'Invalid ID format')
        .regex(/^[a-z0-9]+$/, 'Invalid ID format')
    },
    async ({ id }) => {
      try {
        const note = notes[id]

        if (!note) {
          throw NoteError.notFound(id)
        }

        return {
          content: [{
            type: 'text',
            text: `Title: ${note.title}\nCreated: ${note.createdAt.toISOString()}\n\n${note.content}`
          }]
        }
      } catch (error) {
        if (error instanceof NoteError) {
          return {
            content: [{
              type: 'text',
              text: `Error: ${error.message} (${error.code})`
            }]
          }
        }

        return {
          content: [{
            type: 'text',
            text: 'Error: Failed to retrieve note'
          }]
        }
      }
    }
  )
}
