import { createClient } from "@/utils/supabase/server";
import { createApiResponse, createApiError } from "@/lib/api-response";

/**
 * 获取示例的 Memory
 * @param thread_id example 线程ID
 */
export async function GET(req: Request, { params }: { params: Promise<{ thread_id: string }> }) {
  const { thread_id } = await params;
  if (!thread_id) {
    return createApiError("Thread ID is required", 400);
  }

  const supabase = await createClient();
  const res = await supabase
    .rpc('get_memory_example_by_thread_example_id', {
      te_id: thread_id
    });
  if (res.error) {
    return createApiError(res.error.message, 500);
  }

  return createApiResponse(res.data);
}
