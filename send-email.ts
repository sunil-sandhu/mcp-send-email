import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (
  to: string,
  subject: string,
  message: string
): Promise<Response> => {
  try {
    const response = await fetch("https://notify.cx/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NOTIFY_API_KEY as string,
      },
      body: JSON.stringify({
        from: "Notify MCP <sent-with@mcp.notify.cx>",
        to,
        subject,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
