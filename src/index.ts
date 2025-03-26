import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { registerNoteTools } from './tools/noteTools.js'

/**
 * Main entry point for the MCP server
 */
async function main(): Promise<void> {
  try {
    const server = new McpServer({
      name: 'notes-server',
      version: '1.0.0'
    })

    registerNoteTools(server)

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
