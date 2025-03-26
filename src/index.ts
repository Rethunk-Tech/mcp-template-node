import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

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
            text: 'Welcome to the Notes MCP server! You can:\n\n1. Create notes using the create_note tool\n2. List notes using list_notes\n3. Get a specific note with get_note'
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
