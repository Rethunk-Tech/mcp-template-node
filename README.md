# MCP Template Node

A starter template for creating Model Context Protocol (MCP) servers using Node.js and TypeScript. This template implements a simple note-taking service to demonstrate core MCP concepts.

## What is MCP?

The Model Context Protocol (MCP) is a standardized way for applications to provide context to Large Language Models (LLMs). It separates the concerns of providing context from the actual LLM interaction, allowing for more modular and maintainable AI-powered applications.

## Features

This template includes:

- A complete MCP server implementation with note-taking functionality
- In-memory storage for notes (for demonstration purposes)
- Tools for creating, listing, and retrieving notes
- TypeScript configuration and project structure

### Available Tools

1. `create_note` - Create a new note with a title and content
2. `list_notes` - List all available notes
3. `get_note` - Get a specific note by its ID

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/mcp-template-node.git
   cd mcp-template-node
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```
   or
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   yarn build
   ```
   or
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   yarn start
   ```
   or
   ```bash
   npm start
   ```

## Testing with MCP Inspector

The server runs on stdio, making it compatible with LLM systems that support the MCP protocol. To test it, you can use the MCP Inspector tool:

```bash
yarn inspector
```

This will allow you to interactively test the MCP server's functionality.

Example interactions:

1. Create a note:
   ```json
   {
     "name": "create_note",
     "params": {
       "title": "My First Note",
       "content": "This is a test note created via MCP."
     }
   }
   ```

2. List all notes:
   ```json
   {
     "name": "list_notes",
     "params": {}
   }
   ```

3. Get a specific note:
   ```json
   {
     "name": "get_note",
     "params": {
       "id": "abc123"
     }
   }
   ```

## Project Structure

- `src/index.ts` - Main server implementation with tools and request handlers
- `package.json` - Project configuration and dependencies
- `tsconfig.json` - TypeScript configuration

## Extending the Template

To customize this template for your own MCP server:

1. Define your tools in `src/index.ts`:
   ```typescript
   const myTool: Tool = {
     name: "my_tool",
     description: "Description of what the tool does",
     inputSchema: {
       type: "object",
       required: ["param1"],
       properties: {
         param1: {
           type: "string",
           description: "Description of the parameter"
         }
       }
     }
   };
   ```

2. Add your tool to the list of available tools:
   ```typescript
   server.setRequestHandler(ListToolsRequestSchema, async () => {
     return { tools: [myTool] };
   });
   ```

3. Handle your tool's execution:
   ```typescript
   server.setRequestHandler(CallToolRequestSchema, async (request) => {
     const { name, params } = request.params;

     switch (name) {
       case "my_tool": {
         // Tool implementation
         return {
           content: [
             {
               type: "text",
               text: "Tool result"
             }
           ]
         };
       }
     }
   });
   ```

## License

MIT

## Resources

- [Model Context Protocol Website](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP TypeScript Server Creator](https://github.com/modelcontextprotocol/create-typescript-server)
