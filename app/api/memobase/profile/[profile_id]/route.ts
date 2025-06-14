import { createApiResponse, createApiError } from "@/lib/api-response";

import { createClient } from "@/utils/supabase/server";
import { memoBaseClient } from "@/utils/memobase/client";

/**
 * 删除 profile
 * @param profile_id profile ID
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ profile_id: string }> }) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return createApiError("未授权", 401);
  }

  const { profile_id } = await params;
  if (!profile_id) {
    return createApiError("Bad Request", 400);
  }

  try {
    const user = await memoBaseClient.getOrCreateUser(data.user.id);
    await user.deleteProfile(profile_id);
  } catch (error: unknown) {
    console.error(error);
    return createApiError("删除失败", 500);
  }

  return createApiResponse(null, "删除成功");
}


/**
 * 更新 profile
 * @param profile_id profile ID
 * @param body profile data
 */
export async function PUT(req: Request, { params }: { params: Promise<{ profile_id: string }> }) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return createApiError("未授权", 401);
  }

  const { profile_id } = await params;
  if (!profile_id) {
    return createApiError("Bad Request", 400);
  }

  const { content, topic, sub_topic } = await req.json();
  if (!content || !topic || !sub_topic) {
    return createApiError("Bad Request", 400);
  }

  try {
    const user = await memoBaseClient.getOrCreateUser(data.user.id);
    await user.updateProfile(profile_id, content, topic, sub_topic)
  } catch (error: unknown) {
    console.error(error);
    return createApiError("失败", 500);
  }

  return createApiResponse(null, "成功");
}
