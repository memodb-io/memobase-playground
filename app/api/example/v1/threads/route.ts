import { createClient } from "@/utils/supabase/server";

/**
 * 获取线程列表
 * @returns 线程列表
 */
export async function GET() {
  const supabase = await createClient();

  const res = await supabase.rpc("get_threads_for_example");
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
