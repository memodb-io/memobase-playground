import { createClient } from "@/utils/supabase/server";

/**
 * 修改消息状态
 * @param thread_id 线程ID
 * @param is_archive 是否归档
 * /v1/threads/thread_03MD9BixtUBRK13thC7t83uN
 * @example
 * {
 *   "is_archived": true
 * }
 * @returns 修改成功
 */
export async function PUT(req: Request, { params }: { params: Promise<{ thread_id: string }> }) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { thread_id } = await params;
  const { is_archived } = await req.json();
  if (!thread_id || is_archived === undefined) {
    return new Response("Bad Request", { status: 400 });
  }

  const res = await supabase.rpc("update_thread_archived", {
    thread_id: thread_id,
    archived: is_archived,
    uid: data.user.id,
  });
  if (res.error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
