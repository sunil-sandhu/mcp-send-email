import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { sendEmail } from "./send-email";
import express, { Request, Response } from "express";

// Create an MCP server
const server = new McpServer({
  name: "Send Email",
  version: "1.0.0",
});

// Add an addition tool
server.tool(
  "send-email",
  {
    to: z.string().email().describe("Recipient email address"),
    subject: z.string().describe("Email subject line"),
    message: z.string().describe("Plain text email content"),
  },
  async ({ to, subject, message }) => {
    const response = await sendEmail(to, subject, message);
    if (!response.ok) {
      return {
        content: [{ type: "text", text: `Email failed to send to ${to}` }],
      };
    }
    return {
      content: [{ type: "text", text: `Email sent successfully to ${to}` }],
    };
  }
);

const app = express();
const PORT = 8080;
app.listen(PORT);

const transports: { [sessionId: string]: SSEServerTransport } = {};

app.get("/sse", async (req: Request, res: Response) => {
  const transport = new SSEServerTransport("/send-email", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/send-email", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    const response = await transport.handlePostMessage(req, res);
    return response;
  } else {
    res.status(400).send("No transport found for sessionId");
  }
});
