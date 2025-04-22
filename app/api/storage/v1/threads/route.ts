import { createClient } from "@/utils/supabase/server";

/**
 * 获取线程列表
 * @returns 线程列表
 */
export async function GET() {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const res = await supabase.rpc("get_threads_for_user", {
    uid: data.user.id,
  });
  if (res.error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response(
    JSON.stringify(
      res.data || {
        threads: [],
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

/**
 * 创建线程
 * @param last_message_at 最后一条消息的时间
 * @example
 * {
 *   "last_message_at": "2025-04-21T14:54:41.588Z"
 * }
 * @returns 线程ID
 */
export async function POST(req: Request) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { last_message_at } = await req.json();
  if (!last_message_at) {
    return new Response("Bad Request", { status: 400 });
  }

  const res = await supabase.rpc("create_thread", {
    last_message_at,
    uid: data.user.id,
  });
  if (res.error) {
    return new Response("Internal Server Error", { status: 500 });
  }

  return new Response(JSON.stringify(res.data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
