import { openai } from "@ai-sdk/openai";
import { jsonSchema, streamText } from "ai";

import { createClient } from "@/utils/supabase/server";
import { memoBaseClient } from "@/utils/memobase/client";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const user = await memoBaseClient.getOrCreateUser(data.user.id);

    const context = await user.context(750);

    const { messages, tools } = await req.json();

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages,
      // forward system prompt and tools from the frontend
      system: context,
      tools: Object.fromEntries(
        Object.entries<{ parameters: unknown }>(tools).map(([name, tool]) => [
          name,
          {
            parameters: jsonSchema(tool.parameters!),
          },
        ])
      ),
    });

    const lastMessage = messages[messages.length - 1].content[
      messages[messages.length - 1].content.length - 1
    ].text;

    return result.toDataStreamResponse({
      headers: {
        "x-last-user-message": encodeURIComponent(lastMessage),
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
