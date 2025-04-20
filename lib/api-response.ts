import { NextResponse } from 'next/server';

export interface ApiResponse<T = unknown> {
  code: number;
  data: T | null;
  message: string;
}

export function createApiResponse<T>(
  data: T | null = null,
  message: string = '操作成功',
  code: number = 0
): NextResponse {
  const response: ApiResponse<T> = {
    code,
    data,
    message
  };

  return NextResponse.json(response);
}

export function createApiError(
  message: string = '操作失败',
  code: number = 1
): NextResponse {
  return createApiResponse(null, message, code);
}
