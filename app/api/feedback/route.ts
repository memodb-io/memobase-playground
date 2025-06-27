import { createClient } from "@/utils/supabase/server";
import { createApiResponse, createApiError } from "@/lib/api-response";

/**
 * 创建 feedback
 */
export async function POST(req: Request) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return createApiError("Unauthorized", 401);
  }

  const { type, content } = await req.json();
  if (!type || !content) {
    return createApiError("Invalid request", 400);
  }

  try {
    const res = await supabase
      .rpc('create_feedback_by_uid', {
        c: content,
        t: type,
        uid: data.user.id
      })

    if (res.error) {
      console.error(res.error.message);
      return createApiError("Internal Server Error", 500);
    }

    return createApiResponse(res);
  } catch {
    return createApiError("Internal Server Error", 500);
  }
}
