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

export const addProfile = (content: string, topic: string, subTopic: string): Promise<Res<null>> =>
  service.post("/api/memobase/profile", {
    content,
    topic,
    sub_topic: subTopic,
  });

export const deleteProfile = (id: string): Promise<Res<null>> =>
  service.delete(`/api/memobase/profile/${id}`);

export const updateProfile = (id: string, content: string, topic: string, subTopic: string): Promise<Res<null>> =>
  service.put(`/api/memobase/profile/${id}`, {
    content,
    topic,
    sub_topic: subTopic,
  });

export const deleteEvent = (id: string): Promise<Res<null>> =>
  service.delete(`/api/memobase/event/${id}`);
