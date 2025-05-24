import { openai } from "@/lib/openai";
import { generateText } from "ai";
import { createClient } from "@/utils/supabase/server";

export const maxDuration = 30;

/**
 * 根据第一轮对话的messages和thread_id，生成一个title，并更新thread_id的title
 * @param messages 第一轮对话的messages
 * @param thread_id 线程ID
 * @returns
 */
export async function POST(req: Request) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages, thread_id } = await req.json();
  if (!messages || !thread_id) {
    return new Response("Bad Request", { status: 400 });
  }

  if (!messages.length) {
    return new Response("Bad Request", { status: 400 });
  }

  messages[0].content[0].text = `Give the following user input a title:\n user: ${messages[0].content[0].text}`;
  try {
    const result = await generateText({
      model: openai(process.env.OPENAI_MODEL!),
      messages: [messages[0]],
      system: "You are a title generator, please generate a concise and descriptive title based on the user's first message. The title should be concise and clear, summarizing the user's intention, and not exceed 10 words. Directly output the title without any additional explanation.",
      temperature: 0.5
    });

    const title = result.text;

    const res = await supabase
      .rpc('update_thread_title', {
        t: title,
        thread_id,
        uid: data.user.id
      })
    if (res.error) {
      return new Response("Internal Server Error", { status: 500 });
    }

    return new Response(title, { status: 200 });
  } catch (err) {
    console.error("Error generating title:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
