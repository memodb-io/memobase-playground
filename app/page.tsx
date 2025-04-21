"use client";

import { useRef, useState, useEffect } from "react";

import { AssistantRuntimeProvider } from "@assistant-ui/react";

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

export default function Page() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastUserMessageRef = useRef<string>("");

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await getProfile();
      if (res.code === 0 && res.data) {
        setProfiles(res.data);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("获取记录失败");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const res = await getEvent();
      if (res.code === 0 && res.data) {
        setEvents(res.data);
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("获取记录失败");
    } finally {
      setIsLoading(false);
    }
  };

  const runtime = useChatRuntime({
    api: "/api/chat",
    onResponse: (response) => {
      const message = response.headers.get("x-last-user-message") || "";
      lastUserMessageRef.current = decodeURIComponent(message);
    },
    onFinish: async (message) => {
      if (!message.content || message.content.length === 0) {
        return;
      }

      const lastContent = message.content[message.content.length - 1];
      if (lastContent.type === "text") {
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
          toast.error(res.message);
        }

        flash().then((res) => {
          if (res.code === 0) {
            fetchProfile();
            fetchEvent();
          }
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    fetchProfile();
    fetchEvent();
  }, []);

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
              <UserMenu />
            </div>
          </header>
          <AssistantSidebar>
            <div className="pt-8 px-4">
              <Tabs defaultValue="profiles" className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="profiles">Memories</TabsTrigger>
                    <TabsTrigger value="events">Events</TabsTrigger>
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
                  <div className="grid gap-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
                    {Object.entries(groupedProfiles).map(([topic, profiles]) => (
                      <Card key={topic}>
                        <CardHeader>
                          <CardTitle>{topic}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {profiles.map((profile) => (
                              <div
                                key={profile.id}
                                className="border-b pb-4 last:pb-0 last:border-b-0"
                              >
                                <div className="font-medium text-sm text-muted-foreground mb-1">
                                  {profile.sub_topic}
                                </div>
                                <div className="text-sm">{profile.content}</div>
                                <div className="text-xs text-muted-foreground mt-2">
                                  {new Date(profile.created_at).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="events" className="mt-4">
                  <div className="grid gap-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
                    {events.map((event) => (
                      <Card key={event.id}>
                        <CardHeader>
                          <CardTitle>Event #{event.id}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-sm">
                              {event.event_data?.profile_delta?.map((delta, index) => (
                                <div key={index} className="mb-2">
                                  {delta.content}
                                </div>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(event.created_at).toLocaleString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
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
