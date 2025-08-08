import { createApiResponse } from "@/lib/api-response";

/**
 * 获取用户billing数据
 * @returns
 */
export async function GET() {
  return createApiResponse(null, "pong");
}
