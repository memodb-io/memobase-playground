"use client";

import { useState, useEffect } from "react";

import { AssistantRuntimeProvider, AssistantCloud } from "@assistant-ui/react";

import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantSidebar } from "@/components/assistant-ui/example-assistant-sidebar";
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

import { LangSwitch } from "@/components/lang-switch";
import { ThreadList } from "@/components/assistant-ui/example-thread-list";
import { UserMemory } from "@/components/user-memory";

import { useTranslations } from "next-intl";
import { getMemoryExample, getThreadsExample } from "@/api/models/memobase";
import { ThreadExample } from "@/types";

export default function Page() {
  const t = useTranslations("common");
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threads, setThreads] = useState<ThreadExample[]>([]);

  const cloud = new AssistantCloud({
    baseUrl: `${process.env["NEXT_PUBLIC_BASE_URL"]}${
      process.env["NEXT_PUBLIC_BASE_PATH"] || ""
    }/api/example`,
    anonymous: true,
  });

  const runtime = useChatRuntime({
    api: `${process.env["NEXT_PUBLIC_BASE_PATH"] || ""}/api/chat`,
    cloud,
  });

  const fetchMemory = async (tid: string) => {
    setIsLoading(true);
    try {
      const res = await getMemoryExample(tid);
      if (res.code === 0 && res.data) {
        setProfiles(res.data.profiles);
        setEvents(res.data.events);
      } else {
        toast.error(res.message || t("getRecordsFailed"));
      }
    } catch {
      toast.error(t("getRecordsFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchThreads = async () => {
    setIsLoading(true);
    try {
      const res = await getThreadsExample();
      if (res && res.threads) {
        setThreads(res.threads);
      } else {
        toast.error(t("getRecordsFailed"));
      }
    } catch {
      toast.error(t("getRecordsFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <AppSidebar>
          <ThreadList
            onItemClick={(i) => {
              if (threads.length === 0) return;
              fetchMemory(threads[i].id);
            }}
          />
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
          <AssistantSidebar>
            <UserMemory
              isLoading={isLoading}
              events={events}
              profiles={profiles}
            />
          </AssistantSidebar>
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
}
