import service, { Res } from "../http";
import { UserProfile } from "@memobase/memobase";

export const getProfile = (): Promise<Res<UserProfile[]>> =>
  service.get("/api/memobase/profile");

export const insertMessages = (
  messages: {
    role: "user" | "assistant";
    content: string;
    alias?: string | undefined;
    created_at?: string | undefined;
  }[]
): Promise<Res<null>> => service.post("/api/memobase/insert", { messages });
