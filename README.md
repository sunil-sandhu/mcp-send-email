# MCP Send Email Service (from Notify.cx)

This is a Model Context Protocol (MCP) service that provides email sending capabilities through a server-side event (SSE) based API. The service is built using TypeScript, Express.js, the MCP SDK, and the [Notify.cx](https://notify.cx) API.

## Project Overview

The project is a microservice that:

1. Implements the Model Context Protocol (MCP) for email sending functionality
2. Uses Server-Sent Events (SSE) for real-time communication
3. Provides a simple email sending API endpoint

## Technical Stack

- **Runtime**: Node.js with TypeScript
- **Main Dependencies**:
  - `@modelcontextprotocol/sdk`: ^1.8.0 (MCP SDK for server implementation)
  - `express`: ^5.0.1 (Web server framework)
  - `dotenv`: ^16.4.7 (Environment variable management)
  - `zod`: ^3.24.2 (Schema validation)
- **Development Dependencies**:
  - TypeScript and related type definitions
  - ts-node for TypeScript execution

## Setup Instructions

1. Create a MCP server configuration file (e.g., `mcp.json`).

To get MCPs to work with IDEs such as Cursor, they need an MCP server configuration file.

The MCP server configuration file is a JSON file that describes the MCP server and the tools it supports.

To add the MCP server config in Cursor, go to Cursor > Settings > MCP Servers and add the following:

```json
{
  "mcpServers": {
    "email-sending-service": {
      "name": "email-sending-service",
      "version": "1.0.0",
      "url": "http://localhost:8080/sse",
      "env": {
        "NOTIFY_API_KEY": "<your-notify-api-key>"
      },
      "tools": [
        {
          "name": "send-email",
          "description": "Send an email using Notify",
          "url": "http://localhost:8080/send-email",
          "params": {
            "to": "string",
            "subject": "string",
            "message": "string"
          }
        }
      ]
    }
  }
}
```

2. Create a free Notify.cx account and get an API key.
3. Clone the repository
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a `.env` file with the following variables:
   ```
   NOTIFY_API_KEY=your_api_key_here
   ```
6. Start the server:
   ```bash
   npm start
   ```

The server will start on port 8080.

## API Endpoints

The service exposes two main endpoints:

1. `/sse` (GET)

   - Establishes an SSE connection for real-time communication
   - Used by the MCP protocol for bidirectional communication

2. `/send-email` (POST)
   - Handles email sending requests
   - Requires a `sessionId` query parameter
   - Request body should contain email details (to, subject, message)

## Email Sending Configuration

The service sends emails through a notify service endpoint (`https://notify.cx/api/send-email`) with the following parameters:

- From: sent-with@mcp.notify.cx
- To: (specified in request)
- Subject: (specified in request)
- Message: (specified in request)

## MCP Tool Configuration

The service registers a single MCP tool named "send-email" with the following parameters:

- `to`: Email address (string)
- `subject`: Email subject line (string)
- `message`: Plain text email content (string)

## Error Handling

The service includes comprehensive error handling for:

- Invalid email requests
- Failed email sending attempts
- Missing or invalid session IDs
- Network errors

## Environment Variables

Required environment variables:

- `NOTIFY_API_KEY`: API key for the notification service

## Development

To run the project in development mode:

```bash
npm start
```

The service uses ts-node to run TypeScript files directly.

## Project Structure

- `index.ts`: Main server file containing MCP and Express setup
- `send-email.ts`: Email sending implementation
- `package.json`: Project dependencies and scripts
- `.env`: Environment variables (not committed to version control)
- `tsconfig.json`: TypeScript configuration

This project is a specialized email sending service that implements the Model Context Protocol, making it suitable for integration with AI models or other services that need email sending capabilities.
