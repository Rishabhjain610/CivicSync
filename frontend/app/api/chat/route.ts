import {
  UIMessage,
  streamText,
  convertToModelMessages,
  tool,
  InferUITools,
  UIDataTypes,
} from "ai";
import { NextResponse } from "next/server";
import { createOllama } from "ai-sdk-ollama";
import { tavily } from "@tavily/core";
import { z } from "zod";

const tvly = tavily({
  apiKey: process.env.NEXT_PUBLIC_TAVILY_API_KEY,
});

const BACKEND_URL = "http://localhost:7979";

function cleanContent(content: string) {
  return content.replace(/\s+/g, " ").trim();
}

const tools = {
  civicSearch: tool({
    description: "Search for urban planning, civic laws, or local authority information using Tavily.",
    inputSchema: z.object({
      query: z.string().describe("The search query, e.g. 'waste management rules in Mumbai'"),
    }),
    execute: async ({ query }) => {
      const response = await tvly.search(query);
      const results = response.results.slice(0, 5).map((result: any) => ({
        name: result.title,
        link: result.url,
        description: cleanContent(result.content),
      }));
      
      const combinedSummary = results
        .map((r: any, idx: number) => `${idx + 1}. ${r.name}: ${r.description}`)
        .join("\n\n");

      return { results, combinedSummary };
    },
  }),

  getRecentIssues: tool({
    description: "Fetch the most recent civic issues reported in the system from the database.",
    inputSchema: z.object({
      limit: z.number().optional().default(5).describe("Number of issues to fetch"),
    }),
    execute: async ({ limit }) => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/issues?limit=${limit}`);
        const data = await response.json();
        return { issues: data };
      } catch (error) {
        return { error: "Failed to fetch issues from database" };
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

const ollama = createOllama({ baseURL: "http://127.0.0.1:11434" });

export async function POST(request: Request) {
  const { messages }: { messages: ChatMessage[] } = await request.json();

  try {
    const result = streamText({
      model: ollama("gemma4:31b-cloud"),
      system: `You are the Civic Sync AI Assistant, a specialized agent for the Civic Issue Management System (PS-03).
      
      Your goal is to help citizens and authorities manage urban problems like infrastructure, sanitation, safety, and greenery.
      
      Civic Sync Features:
      - Reporting issues via Web, WhatsApp, and Telegram.
      - AI Forensics for analyzing reported issues.
      - Real-time maps (SVG & Satellite) and Kanban boards.
      - Multi-level drill-down for localities (State > City > Town).
      
      Your Capabilities:
      1. Search for civic laws, urban best practices, or local authority contacts using 'civicSearch'.
      2. View real-time issues reported in the system using 'getRecentIssues'.
      3. Provide guidance on how to report problems or check status.
      
      Guidelines:
      - Be professional, empathetic, and solution-oriented.
      - Use clear, actionable language.
      - If a user asks about specific local problems, use 'getRecentIssues' to see what's happening.
      - If a user asks for regulations or help with a specific type of problem, use 'civicSearch'.
      - Structure your responses with clear headings or bullet points.
      - Respond in the user's language (English, Hindi, Hinglish, etc.).
      
      Disclaimer: You are an AI assistant helping with civic issues. In case of emergencies, users should contact official emergency services directly.`,
      tools,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err: any) {
    console.error("/api/chat error:", err?.stack ?? err);
    return NextResponse.json(
      { error: String(err?.message ?? err) },
      { status: 500 },
    );
  }
}
