import { createOpenAI } from "@ai-sdk/openai";
import { jsonSchema, streamText } from "ai";

import { createClient } from "@/utils/supabase/server";
import { memoBaseClient } from "@/utils/memobase/client";

const openai = createOpenAI({
  baseURL: "https://ark.cn-beijing.volces.com/api/v3",
  apiKey: process.env.OPENAI_API_KEY!,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = await supabase.rpc("get_message_count_by_uid", {
    uid: data.user.id,
  });
  if (res.error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  if (res.data >= 30) {
    return new Response(
      "This is the maximum number of conversations for today, please wait for tomorrow",
      {
        status: 429,
      }
    );
  }

  try {
    const user = await memoBaseClient.getOrCreateUser(data.user.id);

    const context = await user.context(750);

    const { messages, tools } = await req.json();

    const result = streamText({
      model: openai("ep-20250124161018-5wh95"),
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
