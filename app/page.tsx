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

import { RefreshCw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineLayout } from "@/components/timeline/timeline-layout";
import { getTopicIcon } from "@/components/icons/topic-icons";
import { LangSwitch } from "@/components/lang-switch";
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
    baseUrl: `${process.env["NEXT_PUBLIC_BASE_URL"]}/api/storage`,
    // baseUrl: process.env["NEXT_PUBLIC_ASSISTANT_BASE_URL"]!,
    anonymous: true,
  });

  const runtime = useChatRuntime({
    api: "/api/chat",
    cloud: user ? cloud : undefined,
    onResponse: (response) => {
      if (response.status === 401) {
        openDialog();
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
      if (error.message.includes("401")) {
        openDialog();
      } else {
        toast.error(t("chatError"));
      }
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

  const groupedProfiles = profiles.reduce((acc, profile) => {
    if (!acc[profile.topic]) {
      acc[profile.topic] = [];
    }
    acc[profile.topic].push(profile);
    return acc;
  }, {} as Record<string, UserProfile[]>);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <AppSidebar />
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
            <div className="pt-0 px-2 md:pt-4 md:px-4">
              <Tabs defaultValue="profiles" className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="profiles">{t("memories")}</TabsTrigger>
                    <TabsTrigger value="events">{t("events")}</TabsTrigger>
                  </TabsList>
                  <button
                    onClick={() => {
                      fetchProfile();
                      fetchEvent();
                    }}
                    className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                    disabled={isLoading}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                <TabsContent value="profiles">
                  {profiles.length === 0 ? (
                    <div className="p-8 text-center text-sm text-muted-foreground">
                      {t("noContent")}
                    </div>
                  ) : (
                    <div className="grid gap-4 overflow-y-auto max-h-[calc(100dvh-10rem)]">
                      {Object.entries(groupedProfiles).map(
                        ([topic, profiles]) => (
                          <Card key={topic}>
                            <CardHeader>
                              <CardTitle>{topic}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {profiles.map((profile) => {
                                  const Icon = getTopicIcon(profile.sub_topic);
                                  return (
                                    <div
                                      key={profile.id}
                                      className="border-b pb-4 last:pb-0 last:border-b-0"
                                    >
                                      <div className="font-medium text-sm text-muted-foreground mb-1 flex items-center gap-2">
                                        <Icon className="w-4 h-4" />
                                        {profile.sub_topic}
                                      </div>
                                      <div className="text-sm">
                                        {profile.content}
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-2">
                                        {new Date(
                                          profile.created_at
                                        ).toLocaleString()}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      )}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="events">
                  <div className="overflow-y-auto max-h-[calc(100dvh-10rem)]">
                    <TimelineLayout
                      items={events.flatMap((event) => {
                        const deltas = event.event_data?.profile_delta || [];
                        return deltas.map((delta) => {
                          const topic = delta.attributes?.topic || "default";
                          const subTopic =
                            delta.attributes?.sub_topic || "default";
                          const Icon = getTopicIcon(subTopic);

                          return {
                            id: parseInt(event.id),
                            date: new Date(event.created_at).toLocaleString(),
                            title: `${topic} - ${subTopic}`,
                            description: delta.content || t("noContent"),
                            color: "primary",
                            icon: <Icon className="w-4 h-4" />,
                          };
                        });
                      })}
                      size="sm"
                      animate={true}
                      loading={isLoading}
                      emptyText={t("noContent")}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </AssistantSidebar>
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
}
