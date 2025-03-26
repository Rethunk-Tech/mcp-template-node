import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerNoteTools } from './tools/noteTools.js'

/**
 * Main entry point for the MCP server
 *
 * This is a complete example from the MCP getting started guide:
 *
 * The Model Context Protocol (MCP) allows LLMs to interact with your server through:
 * - Resources: Data sources that work like read-only GET endpoints
 * - Tools: Functions that can perform actions and have side effects
 * - Prompts: Templates to guide LLM interactions
 */
async function main(): Promise<void> {
  try {
    // Initialize the MCP server with metadata
    const server = new McpServer({
      name: 'example-mcp-server',
      version: '1.0.0'
    })

    // Register our note tools from the implementation
    registerNoteTools(server)

    // Example of a static resource - provides configuration data
    server.resource(
      'config',
      'config://app',
      async (uri) => ({
        contents: [{
          uri: uri.href,
          text: 'Example configuration for the notes application'
        }]
      })
    )

    // Example of a dynamic resource with parameters
    // noteId: The unique identifier of the note to retrieve metadata for (e.g., "abc123")
    server.resource(
      'note-info',
      new ResourceTemplate('notes://{noteId}/info', { list: undefined }),
      async (uri, { noteId }) => ({
        contents: [{
          uri: uri.href,
          text: `Metadata for note ${noteId}`
        }]
      })
    )

    // Example of a prompt template
    server.prompt(
      'help',
      {},
      () => ({
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Welcome to the Notes MCP server! You can use the following tools:

1. Create a new note
   Tool: create_note
   Parameters:
   - title: A unique title for your note (required, max 100 chars)
   - content: The body text of your note (required, max 10000 chars)
   Example: { "title": "Meeting Notes", "content": "Discussed project timeline" }

2. List all available notes
   Tool: list_notes
   Parameters: None
   This tool shows all notes with their IDs, which you'll need for retrieving specific notes.

3. Get a specific note by ID
   Tool: get_note
   Parameters:
   - id: The note's unique identifier (required, alphanumeric, max 8 chars)
   Example: { "id": "abc123" }
   Tip: Use list_notes first to find the ID of the note you want.

You can also access resources like 'config://app' for application configuration or 'notes://{noteId}/info' for note metadata.`
          }
        }]
      })
    )

    // Connect using stdio transport
    const transport = new StdioServerTransport()
    await server.connect(transport)
  } catch (error) {
    console.error('Server initialization error:', error)
    process.exit(1)
  }
}

main().catch((error: Error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
