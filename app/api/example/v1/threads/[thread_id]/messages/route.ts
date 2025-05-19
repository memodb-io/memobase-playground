import { createClient } from "@/utils/supabase/server";

/**
 * 获取消息
 * @param thread_id 线程ID
 * @example
 * /v1/threads/thread_03MD9BixtUBRK13thC7t83uN/messages
 * @returns 消息列表
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ thread_id: string }> }
) {
  const supabase = await createClient();

  const { thread_id } = await params;
  if (!thread_id) {
    return new Response("Bad Request", { status: 400 });
  }

  const res = await supabase.rpc("get_messages_example_by_thread", {
    tid: thread_id,
  });

  if (res.error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response(
    JSON.stringify(
      res.data || {
        messages: [],
      }
    ),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
