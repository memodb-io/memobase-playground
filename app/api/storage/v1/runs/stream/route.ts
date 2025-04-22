import { createClient } from "@/utils/supabase/server";

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

  // TODO: 根据messages和thread_id，生成一个title，并更新thread_id的title

  return new Response(null, {
    status: 200,
  });
}
