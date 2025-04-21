import { createApiResponse, createApiError } from "@/lib/api-response";

import { createClient } from "@/utils/supabase/server";
import { memoBaseClient } from "@/utils/memobase/client";

export async function GET() {
  try {
    // get user from supabase
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return createApiError("未授权", 401);
    }

    const user = await memoBaseClient.getOrCreateUser(data.user.id);
    const event = await user.event();

    return createApiResponse(event, "获取记录成功");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "获取记录失败";
    return createApiError(errorMessage, 500);
  }
}
