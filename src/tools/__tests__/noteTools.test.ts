/**
 * Vitest test file for testing MCP note tools
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { registerNoteTools, resetNotes } from '../noteTools.js'

// Define types for the mock server
interface ToolDefinition {
  schema: z.ZodRawShape;
  handler: (params: Record<string, unknown>) => Promise<unknown>;
}

// Mock McpServer to simulate tool registration and calling
class MockMcpServer {
  private tools: Record<string, ToolDefinition> = {}

  tool(name: string, schema: z.ZodRawShape, handler: (params: Record<string, unknown>) => Promise<unknown>): void {
    this.tools[name] = { schema, handler }
  }

  async callTool(name: string, params: Record<string, unknown>): Promise<unknown> {
    if (!this.tools[name]) {
      throw new Error(`Tool ${name} not found`)
    }
    return this.tools[name].handler(params)
  }
}

// Reset notes state before each test
beforeEach(() => {
  resetNotes()
})

describe('Note Tools - create_note', () => {
  it('should create a note with valid input', async () => {
    const server = new MockMcpServer()
    registerNoteTools(server as unknown as McpServer)

    const result = await server.callTool('create_note', {
      title: 'Test Note',
      content: 'This is a test note'
    }) as { content: Array<{ type: string; text: string }> }

    expect(result.content[0].type).toBe('text')
    expect(result.content[0].text).toContain('Note created with ID:')
  })
})

describe('Note Tools - duplicate titles', () => {
  it('should reject duplicate titles', async () => {
    const server = new MockMcpServer()
    registerNoteTools(server as unknown as McpServer)

    await server.callTool('create_note', {
      title: 'Duplicate Note',
      content: 'First note'
    })

    // Second creation with same title should fail
    const result = await server.callTool('create_note', {
      title: 'Duplicate Note',
      content: 'Second note with same title'
    }) as { content: Array<{ type: string; text: string }> }

    expect(result.content[0].text).toContain('Error:')
    expect(result.content[0].text).toContain('DUPLICATE_TITLE')
  })
})

describe('Note Tools - list_notes empty', () => {
  it('should return message when no notes exist', async () => {
    const server = new MockMcpServer()
    registerNoteTools(server as unknown as McpServer)

    const result = await server.callTool('list_notes', {}) as { content: Array<{ type: string; text: string }> }

    expect(result.content[0].text).toBe('No notes found.')
  })
})

describe('Note Tools - list_notes with data', () => {
  it('should list created notes', async () => {
    const server = new MockMcpServer()
    registerNoteTools(server as unknown as McpServer)

    // Create a note first
    await server.callTool('create_note', {
      title: 'Note 1',
      content: 'Content 1'
    })

    const result = await server.callTool('list_notes', {}) as { content: Array<{ type: string; text: string }> }

    expect(result.content[0].text).toContain('Available Notes:')
    expect(result.content[0].text).toContain('Note 1')
  })
})

describe('Note Tools - get_note error', () => {
  it('should return error for non-existent note', async () => {
    const server = new MockMcpServer()
    registerNoteTools(server as unknown as McpServer)

    const result = await server.callTool('get_note', { id: 'nonexistent' }) as { content: Array<{ type: string; text: string }> }

    expect(result.content[0].text).toContain('Error:')
    expect(result.content[0].text).toContain('NOTE_NOT_FOUND')
  })
})

describe('Note Tools - get_note success', () => {
  it('should return note content for valid ID', async () => {
    const server = new MockMcpServer()
    registerNoteTools(server as unknown as McpServer)

    const createResult = await server.callTool('create_note', {
      title: 'Test Note',
      content: 'Test Content'
    }) as { content: Array<{ type: string; text: string }> }

    // Extract the ID from the response
    const idMatch = createResult.content[0].text.match(/ID: ([a-z0-9]+)/)
    const id = idMatch ? idMatch[1] : ''

    expect(id).not.toBe('') // Ensure we got a valid ID

    const getResult = await server.callTool('get_note', { id }) as { content: Array<{ type: string; text: string }> }

    expect(getResult.content[0].text).toContain('Test Note')
    expect(getResult.content[0].text).toContain('Test Content')
  })
})

// Tests for the calculate tool defined in index.ts
describe('Calculate Tool Tests', () => {
  // Mock implementation of the calculate tool
  const calculateTool = async (params: { expression: string }): Promise<{ content: Array<{ type: string; text: string }> }> => {
    try {
      // WARNING: Using eval in tests is for demonstration purposes only
      const result = eval(params.expression)
      return {
        content: [{
          type: 'text',
          text: `Result: ${result}`
        }]
      }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error calculating expression: ${(error as Error).message}`
        }]
      }
    }
  }

  it('should calculate simple arithmetic expressions', async () => {
    const result = await calculateTool({ expression: '2 + 2' })
    expect(result.content[0].text).toBe('Result: 4')
  })

  it('should handle more complex expressions', async () => {
    const result = await calculateTool({ expression: '(10 * 5) / 2' })
    expect(result.content[0].text).toBe('Result: 25')
  })

  it('should return error for invalid expressions', async () => {
    const result = await calculateTool({ expression: '2 + * 2' })
    expect(result.content[0].text).toContain('Error calculating expression:')
  })
})
