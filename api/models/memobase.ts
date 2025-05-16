import service, { Res } from "../http";
import { UserProfile, UserEvent } from "@memobase/memobase";
import { MemoryExample, ThreadExample } from "@/types"

export const getProfile = (): Promise<Res<UserProfile[]>> =>
  service.get("/api/memobase/profile");

export const insertMessages = (
  messages: {
    role: "user" | "assistant";
    content: string;
    alias?: string | undefined;
    created_at?: string | undefined;
  }[]
): Promise<Res<null>> =>
  service.post("/api/memobase/insert", {
    messages,
  });

export const flash = (): Promise<Res<null>> =>
  service.post("/api/memobase/flash");

export const getEvent = (): Promise<Res<UserEvent[]>> =>
  service.get("/api/memobase/event");

export const getThreadsExample = (): Promise<{ threads: ThreadExample[] }> =>
  service.get("/api/example/v1/threads");

export const getMemoryExample = (tid: string): Promise<Res<MemoryExample>> =>
  service.get(`/api/example/${tid}`);
