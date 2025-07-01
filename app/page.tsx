"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import * as React from "react";

import { AssistantRuntimeProvider, AssistantCloud } from "@assistant-ui/react";

import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantSidebar } from "@/components/assistant-ui/assistant-sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { UserProfile, UserEvent } from "@memobase/memobase";

import { toast } from "sonner";

import {
  flash,
  getProfile,
  insertMessages,
  getEvent,
} from "@/api/models/memobase";

import { ThreadList } from "@/components/assistant-ui/thread-list";
import { UserMemory } from "@/components/user-memory";
import { Thread } from "@/components/assistant-ui/thread";

import { useTranslations } from "next-intl";
import { useLoginDialog } from "@/stores/use-login-dialog";
import { useUserStore } from "@/stores/user";
import CommonHeader from "@/components/common-header";

export default function Page() {
  const t = useTranslations("common");
  const { user } = useUserStore();
  const { openDialog } = useLoginDialog();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastUserMessageRef = useRef<string>("");
  const hasFetchedRef = useRef(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getProfile();
      if (res.code === 401) {
        openDialog();
        return;
      }
      if (res.code === 0) {
        setProfiles(res.data || []);
      } else {
        toast.error(res.message || t("getRecordsFailed"));
      }
    } catch {
      toast.error(t("getRecordsFailed"));
    } finally {
      setIsLoading(false);
    }
  }, [t, openDialog]);

  const fetchEvent = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getEvent();
      if (res.code === 401) {
        openDialog();
        return;
      }
      if (res.code === 0) {
        setEvents(res.data || []);
      } else {
        toast.error(res.message || t("getRecordsFailed"));
      }
    } catch {
      toast.error(t("getRecordsFailed"));
    } finally {
      setIsLoading(false);
    }
  }, [t, openDialog]);

  const cloud = new AssistantCloud({
    baseUrl: `${process.env["NEXT_PUBLIC_BASE_URL"]}${
      process.env["NEXT_PUBLIC_BASE_PATH"] || ""
    }/api/storage`,
    anonymous: true,
  });

  const runtime = useChatRuntime({
    api: `${process.env["NEXT_PUBLIC_BASE_PATH"] || ""}/api/chat`,
    cloud: user ? cloud : undefined,
    onResponse: (response) => {
      if (response.status !== 200) {
        return;
      }

      const message = response.headers.get("x-last-user-message") || "";
      lastUserMessageRef.current = decodeURIComponent(message);
    },
    onFinish: async (message) => {
      if (!message.content || message.content.length === 0) {
        return;
      }

      const lastContent = message.content[message.content.length - 1];
      if (lastContent.type === "text") {
        try {
          const res = await insertMessages([
            {
              role: "user",
              content: lastUserMessageRef.current,
            },
            {
              role: "assistant",
              content: lastContent.text,
            },
          ]);
          if (res.code !== 0) {
            toast.error(res.message || t("insertRecordsFailed"));
            return;
          }

          const flashRes = await flash();
          if (flashRes.code === 0) {
            fetchProfile();
            fetchEvent();
          } else {
            toast.error(flashRes.message || t("flashRecordsFailed"));
          }
        } catch {
          toast.error(t("insertRecordsFailed"));
        }
      }
    },
    onError: (error) => {
      if (error.message.includes("429")) {
        toast.error(t("chatMaxConversations"));
        return;
      }

      if (error.message.includes("401")) {
        openDialog();
        return;
      }

      toast.error(t("chatError"));
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      if (user && !hasFetchedRef.current) {
        hasFetchedRef.current = true;
        await fetchProfile();
        await fetchEvent();
      }
    };
    checkUser();
  }, [user, fetchProfile, fetchEvent, openDialog, t]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <AppSidebar>
          <ThreadList />
        </AppSidebar>
        <SidebarInset>
          <CommonHeader />
          <AssistantSidebar threadSlot={<Thread />}>
            <UserMemory
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              events={events}
              profiles={profiles}
              onRefresh={() => {
                fetchProfile();
                fetchEvent();
              }}
              canAdd
              canEdit
              canDelete
            />
          </AssistantSidebar>
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
}
