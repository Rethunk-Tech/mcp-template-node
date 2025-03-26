# Contributing to MCP Template Node

Thank you for your interest in contributing to the MCP Template Node project! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Prerequisites**
   - Node.js 18 or later
   - npm or yarn
   - Git

2. **Clone and Install**
   ```bash
   git clone https://github.com/yourusername/mcp-template-node.git
   cd mcp-template-node
   yarn install  # or npm install
   ```

3. **Development Scripts**
   - `yarn build` - Build the project
   - `yarn dev` - Watch mode for development
   - `yarn lint` - Run ESLint
   - `yarn lint:fix` - Fix ESLint issues
   - `yarn inspector` - Run MCP Inspector for testing
   - `yarn clean` - Clean build artifacts

## Project Structure

```
src/
├── errors/     # Custom error classes
├── tools/      # MCP tool implementations
├── types/      # TypeScript type definitions
└── index.ts    # Main server entry point
```

## Coding Guidelines

1. **TypeScript**
   - Use strict mode
   - Add type annotations for function parameters and return types
   - Use interfaces for object types
   - Document public APIs with JSDoc comments

2. **Error Handling**
   - Use custom error classes for domain-specific errors
   - Include error codes for better error identification
   - Handle all possible error cases

3. **Tool Implementation**
   - Keep tools focused and single-purpose
   - Use Zod for input validation
   - Follow the MCP response format
   - Include comprehensive error handling

4. **Testing**
   - Test tools using MCP Inspector
   - Verify error cases
   - Check input validation

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting and tests
5. Commit using conventional commits format
6. Push to your fork
7. Create a Pull Request

## Conventional Commits

We use the Conventional Commits specification for commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Example:
```
feat(tools): add new note search tool

Implements fuzzy search for notes using title and content.
```

## Questions or Problems?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase
- Suggestions for improvements
