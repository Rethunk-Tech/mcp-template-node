import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { vi } from 'vitest';
import { Note } from '../types/note.js';

/**
 * Mock McpServer implementation for testing tools
 */
export class MockMcpServer {
  tools: Record<string, { schema: any; handler: Function }> = {}

  tool(name: string, schema: any, handler: Function): this {
    this.tools[name] = { schema, handler }
    return this
  }

  resource(name: string, uri: any, handler: Function): this {
    return this
  }

  prompt(name: string, schema: any, handler: Function): this {
    return this
  }

  async callTool(name: string, params: any): Promise<any> {
    if (!this.tools[name]) {
      throw new Error(`Tool not found: ${name}`)
    }
    return this.tools[name].handler(params)
  }
}

/**
 * Create a mock note for testing
 */
export function createMockNote(overrides: Partial<Note> = {}): Note {
  const now = new Date()

  return {
    id: 'test123',
    title: 'Test Note',
    content: 'This is a test note',
    createdAt: now,
    updatedAt: now,
    ...overrides
  }
}

/**
 * Create a spy for console methods
 */
export function mockConsole(): { restore: () => void } {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
  const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  return {
    restore: () => {
      errorSpy.mockRestore()
      infoSpy.mockRestore()
      logSpy.mockRestore()
      warnSpy.mockRestore()
    }
  }
}

/**
 * Extract ID from a tool response
 */
export function extractIdFromResponse(response: any): string {
  const text = response.content[0].text
  const match = text.match(/ID: ([a-z0-9]+)/)
  return match ? match[1] : ''
}

/**
 * Create a complete mock of McpServer for integration tests
 */
export function createMockMcpServer(): { server: McpServer; transport: any } {
  const server = {
    resource: vi.fn().mockReturnThis(),
    prompt: vi.fn().mockReturnThis(),
    connect: vi.fn().mockResolvedValue(undefined),
    tool: vi.fn().mockReturnThis()
  } as unknown as McpServer

  const transport = {
    onMessage: vi.fn(),
    sendMessage: vi.fn()
  }

  return { server, transport }
}
