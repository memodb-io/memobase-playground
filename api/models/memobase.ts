import service, { Res } from "../http";
import { UserProfile, UserEvent } from "@memobase/memobase";

export const getProfile = (): Promise<Res<UserProfile[]>> =>
  service.get(`${process.env["NEXT_PUBLIC_BASE_PATH"]}/api/memobase/profile`);

export const insertMessages = (
  messages: {
    role: "user" | "assistant";
    content: string;
    alias?: string | undefined;
    created_at?: string | undefined;
  }[]
): Promise<Res<null>> =>
  service.post(`${process.env["NEXT_PUBLIC_BASE_PATH"]}/api/memobase/insert`, {
    messages,
  });

export const flash = (): Promise<Res<null>> =>
  service.post(`${process.env["NEXT_PUBLIC_BASE_PATH"]}/api/memobase/flash`);

export const getEvent = (): Promise<Res<UserEvent[]>> =>
  service.get(`${process.env["NEXT_PUBLIC_BASE_PATH"]}/api/memobase/event`);
