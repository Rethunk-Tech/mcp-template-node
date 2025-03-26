# MCP Template Node

A template repository for creating Model Context Protocol (MCP) servers in Node.js/TypeScript. This template demonstrates how to build a simple notes management system using the MCP protocol, which can be used with LLM-powered applications.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for applications to provide context to Large Language Models (LLMs). It separates the concerns of providing context from the actual LLM interaction, allowing for more modular and maintainable AI-powered applications.

Learn more at the [Model Context Protocol Website](https://modelcontextprotocol.github.io/).

## Features

- TypeScript implementation with strict type checking
- ESLint configuration with sensible defaults
- Simple notes management system with create, list, and get operations
- In-memory storage (easily replaceable with a database)
- Well-organized code structure with separate concerns
- Comprehensive error handling and validation
- Example test structure
- VS Code debugging configuration

## Prerequisites

- Node.js 18 or later
- npm or yarn

## Project Structure

```
mcp-template-node/
├── src/
│   ├── errors/        # Custom error classes
│   ├── tools/         # MCP tool implementations
│   │   └── __tests__/ # Tool tests
│   ├── types/         # TypeScript type definitions
│   └── index.ts       # Main server entry point
├── .vscode/           # VS Code configuration
├── build/             # Compiled JavaScript files
├── package.json       # Project configuration
├── tsconfig.json      # TypeScript configuration
└── .eslintrc.json     # ESLint configuration
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mcp-template-node.git
   cd mcp-template-node
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Build the project:
   ```bash
   yarn build
   ```

4. Run the server:
   ```bash
   yarn start
   ```

## Development

1. Start the TypeScript compiler in watch mode:
   ```bash
   yarn dev
   ```

2. Lint your code:
   ```bash
   yarn lint
   ```

3. Fix linting issues:
   ```bash
   yarn lint:fix
   ```

4. Run tests:
   ```bash
   yarn test
   ```

## Testing with MCP Inspector

For standalone testing, you can use the MCP Inspector tool:

```bash
yarn inspector
```

This will open an interactive session where you can test your MCP tools.

## Available Tools

### 1. Create Note
Creates a new note with a title and content.

**Parameters:**
- `title` (string): The title of the note
- `content` (string): The content of the note

**Example:**
```json
{
  "title": "Meeting Minutes",
  "content": "Discussed project timeline and milestones..."
}
```

### 2. List Notes
Lists all available notes.

**Parameters:** None

### 3. Get Note
Retrieves a specific note by its ID.

**Parameters:**
- `id` (string): The ID of the note to retrieve

**Example:**
```json
{
  "id": "abc123"
}
```

## Integrating with LLM Applications

To use this MCP server with an LLM application:

1. Start the MCP server
2. Configure your LLM application to connect to the MCP server
3. The LLM can now use the tools provided by the server to manage notes

Check your LLM application's documentation for specific integration steps.

## Extending the Template

To add new tools to the MCP server:

1. Add type definitions in `src/types/`
2. Add error types in `src/errors/` if needed
3. Create a new tool implementation in `src/tools/`
4. Register the tool in the server

Example new tool implementation:

```typescript
// src/tools/searchTools.ts
import { z } from 'zod'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export function registerSearchTools(server: McpServer): void {
  server.tool(
    'search_notes',
    {
      query: z.string().min(1, 'Search query is required')
    },
    async ({ query }) => {
      // Implementation here
      return {
        content: [{
          type: 'text',
          text: `Search results for: ${query}`
        }]
      }
    }
  )
}
```

Then register it in `src/index.ts`:

```typescript
import { registerSearchTools } from './tools/searchTools.js'

// In main function
registerSearchTools(server)
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

MIT

## Resources

- [Model Context Protocol Website](https://modelcontextprotocol.github.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP TypeScript Server Creator](https://github.com/modelcontextprotocol/create-typescript-server)
