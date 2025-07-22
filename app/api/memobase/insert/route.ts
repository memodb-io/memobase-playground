import { createApiResponse, createApiError } from "@/lib/api-response";

import { createClient } from "@/utils/supabase/server";
import { memoBaseClient } from "@/utils/memobase/client";

import { BlobType, Blob } from "@memobase/memobase";

export async function POST(req: Request) {
  // get user from supabase
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return createApiError("未授权", 401);
  }

  const { messages } = await req.json();
  if (!messages) {
    return createApiError("参数错误", 400);
  }

  try {
    const user = await memoBaseClient.getOrCreateUser(data.user.id);
    await user.insert(
      Blob.parse({
        type: BlobType.Enum.chat,
        messages: messages,
      }),
      true
    );
  } catch {
    return createApiError("插入失败", 500);
  }

  return createApiResponse(null, "插入成功");
}
