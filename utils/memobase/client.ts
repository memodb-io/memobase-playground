import { MemoBaseClient } from "@memobase/memobase";

export const memoBaseClient = new MemoBaseClient(
  process.env.NEXT_PUBLIC_MEMOBASE_PROJECT_URL!,
  process.env.NEXT_PUBLIC_MEMOBASE_API_KEY!
);
