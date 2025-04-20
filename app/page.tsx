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

import { UserProfile } from "@memobase/memobase";

import { toast } from "sonner";

import { getProfile, insertMessages } from "@/api/models/memobase";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RefreshCw } from "lucide-react";

export default function Page() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastUserMessageRef = useRef<string>("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getProfile();
      if (res.code === 0 && res.data) {
        setProfiles(res.data);
        toast.success("数据已更新");
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
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

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
          <div className="flex flex-1 flex-col gap-4">
            <AssistantSidebar>
              <div className="pt-8 px-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Your Memories</h2>
                  <button
                    onClick={fetchData}
                    className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                    disabled={isLoading}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>主题</TableHead>
                      <TableHead>内容</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.sub_topic}</TableCell>
                        <TableCell>{profile.content}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AssistantSidebar>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
}
