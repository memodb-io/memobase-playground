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
    const profiles = await user.profile();

    return createApiResponse(profiles, "获取记录成功");
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "获取记录失败";
    return createApiError(errorMessage, 500);
  }
}

/**
 * 添加 profile
 * @param body profile data
 */
export async function POST(req: Request) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return createApiError("未授权", 401);
  }

  const { content, topic, sub_topic } = await req.json();
  if (!content || !topic || !sub_topic) {
    return createApiError("Bad Request", 400);
  }

  try {
    const user = await memoBaseClient.getOrCreateUser(data.user.id);
    await user.addProfile(content, topic, sub_topic)
  } catch (error: unknown) {
    console.error(error);
    return createApiError("失败", 500);
  }

  return createApiResponse(null, "成功");
}
