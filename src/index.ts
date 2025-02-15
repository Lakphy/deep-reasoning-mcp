import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText } from "ai";
import {
  getReasoningModelProcessTarget,
  getReasoningModelSystem,
  getResponsePrompt,
} from "./prompt";

const apiKey =
  process.argv.find((arg) => arg.startsWith("--apiKey="))?.split("=")[1] ||
  process.env.OPEN_ROUTER_API_KEY;

const model =
  process.argv.find((arg) => arg.startsWith("--model="))?.split("=")[1] ||
  "deepseek/deepseek-r1-distill-qwen-32b";

if (!apiKey) {
  throw new Error("API key is required");
}

const openrouter = createOpenRouter({
  apiKey: apiKey,
});

export const server = new McpServer({
  name: process.env.APP_NAME || "deep-reasoning-server",
  version: process.env.APP_VERSION || "0.0.1",
});

server.tool(
  "deep-reasoning",
  "Deep inference analysis of any input. This is a powerful deep reasoning tool that helps in analyzing issues, user intent, code logic, etc. This tool should be prioritized for analysis before working on any problem. If you can connect to the internet, you can search for more information as context before reasoning.",
  {
    statement: z
      .string()
      .describe(
        "Content to be analyzed by inference, which can be questions, statements, user intent, etc."
      ),
    context: z
      .string()
      .optional()
      .describe(
        "Important contextual information for enhancing the accuracy and completeness of reasoning. It is highly recommended to provide relevant contextual information, historical data, constraints, etc. for a more comprehensive analysis. Even in cases of uncertainty, it is recommended to provide context that may be relevant"
      ),
  },
  async ({ statement, context }) => {
    try {
      const startTime = Date.now();
      const result = streamText({
        model: openrouter(model, {
          includeReasoning: true,
        }),
        system: getReasoningModelSystem(),
        messages: [
          {
            role: "user",
            content: getReasoningModelProcessTarget({ statement, context }),
          },
        ],
      });

      for await (const textPart of result.textStream) continue;

      const resultText = await result.text;
      const resultReasoning = await result.reasoning;

      const duration = (Date.now() - startTime) / 1000;

      return {
        content: [
          {
            type: "text",
            text: getResponsePrompt({
              text: resultText,
              reasoning: resultReasoning || "",
              duration,
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: JSON.stringify({ error }) }],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
