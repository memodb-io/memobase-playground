"use client";

import { useRef, useState, useEffect } from "react";
import * as React from "react";

import { AssistantRuntimeProvider, AssistantCloud } from "@assistant-ui/react";

import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantSidebar } from "@/components/assistant-ui/assistant-sidebar";
import { UserMenu } from "@/components/user-menu";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

import { UserProfile, UserEvent } from "@memobase/memobase";

import { toast } from "sonner";

import {
  flash,
  getProfile,
  insertMessages,
  getEvent,
} from "@/api/models/memobase";

import { LangSwitch } from "@/components/lang-switch";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { UserMemory } from "@/components/user-memory";
import { Thread } from "@/components/assistant-ui/thread";

import { useTranslations } from "next-intl";
import { useLoginDialog } from "@/stores/use-login-dialog";
import { useUserStore } from "@/stores/user";

export default function Page() {
  const t = useTranslations("common");
  const { user } = useUserStore();
  const { openDialog } = useLoginDialog();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastUserMessageRef = useRef<string>("");
  const hasFetchedRef = useRef(false);

  const fetchProfile = async () => {
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
  };

  const fetchEvent = async () => {
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
  };

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
  }, [user]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <AppSidebar>
          <ThreadList />
        </AppSidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex-1 flex items-center gap-2 px-3">
              <SidebarTrigger />
              <div className="flex-1" />
              <ThemeToggle />
              <LangSwitch />
              <UserMenu />
            </div>
          </header>
          <AssistantSidebar threadSlot={<Thread />}>
            <UserMemory
              isLoading={isLoading}
              events={events}
              profiles={profiles}
              onRefresh={() => {
                fetchProfile();
                fetchEvent();
              }}
            />
          </AssistantSidebar>
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
}
