import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js"

// Simple note storage (in-memory database)
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

// Store notes in memory (would be a database in a real application)
const notes: Record<string, Note> = {};

// Generate a simple ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Define tools
const createNoteTool: Tool = {
  name: "create_note",
  description: "Create a new note with title and content",
  inputSchema: {
    type: "object",
    required: ["title", "content"],
    properties: {
      title: {
        type: "string",
        description: "The title of the note"
      },
      content: {
        type: "string",
        description: "The content of the note"
      }
    }
  }
};

const listNotesTool: Tool = {
  name: "list_notes",
  description: "List all available notes",
  inputSchema: {
    type: "object",
    properties: {}
  }
};

const getNoteTool: Tool = {
  name: "get_note",
  description: "Get a note by its ID",
  inputSchema: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        description: "The ID of the note to retrieve"
      }
    }
  }
};

// Create the MCP server
const server = new Server(
  {
    name: "notes-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [createNoteTool, listNotesTool, getNoteTool] };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, params } = request.params;

  switch (name) {
    case "create_note": {
      const { title, content } = params as { title: string; content: string };
      const id = generateId();
      const note: Note = {
        id,
        title,
        content,
        createdAt: new Date(),
      };

      notes[id] = note;

      return {
        content: [
          {
            type: "text",
            text: `Note created with ID: ${id}`,
          },
        ],
      };
    }

    case "list_notes": {
      const notesList = Object.values(notes);

      if (notesList.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No notes found.",
            },
          ],
        };
      }

      const formattedNotes = notesList.map(note =>
        `ID: ${note.id}\nTitle: ${note.title}\nCreated: ${note.createdAt.toISOString()}\n---\n`
      ).join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Available Notes:\n\n${formattedNotes}`,
          },
        ],
      };
    }

    case "get_note": {
      const { id } = params as { id: string };
      const note = notes[id];

      if (!note) {
        return {
          content: [
            {
              type: "text",
              text: `Note with ID ${id} not found.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Title: ${note.title}\nCreated: ${note.createdAt.toISOString()}\n\n${note.content}`,
          },
        ],
      };
    }

    default:
      throw new Error(`Tool ${name} not found`);
  }
});

// Start the server
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Notes MCP Server running on stdio");
}

main().catch((error: Error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
