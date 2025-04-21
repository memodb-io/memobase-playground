import { createApiResponse, createApiError } from "@/lib/api-response";

import { createClient } from "@/utils/supabase/server";
import { memoBaseClient } from "@/utils/memobase/client";

export async function POST() {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return createApiError("未授权", 401);
  }

  try {
    const user = await memoBaseClient.getOrCreateUser(data.user.id);
    await user.flush();
  } catch {
    return createApiError("失败", 500);
  }

  return createApiResponse(null, "成功");
}
