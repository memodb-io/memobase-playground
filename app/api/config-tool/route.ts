import { openai } from "@/lib/openai";
import { jsonSchema, streamText } from "ai";

import { createClient } from "@/utils/supabase/server";
import systemPrompt from "@/prompts/config_prompt.md?raw";

export const maxDuration = 30;

export async function POST(req: Request) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { messages, tools } = await req.json();

    const result = streamText({
      model: openai(process.env.OPENAI_MODEL!),
      messages,
      // forward system prompt and tools from the frontend
      system: systemPrompt,
      tools: Object.fromEntries(
        Object.entries<{ parameters: unknown }>(tools).map(([name, tool]) => [
          name,
          {
            parameters: jsonSchema(tool.parameters!),
          },
        ])
      ),
    });

    const lastMessage =
      messages[messages.length - 1].content[
        messages[messages.length - 1].content.length - 1
      ].text;

    return result.toDataStreamResponse({
      headers: {
        "x-last-user-message": encodeURIComponent(lastMessage),
      },
      getErrorMessage(error) {
        if (error instanceof Error) {
          return error.message;
        }
        return "Internal Server Error";
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
