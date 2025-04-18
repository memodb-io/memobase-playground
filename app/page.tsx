"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";

import { AssistantSidebar } from "@/components/assistant-ui/assistant-sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Page() {
  const runtime = useChatRuntime({
    api: "/api/chat",
  });

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
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4">
            <AssistantSidebar>
              <h2>Your Memories</h2>
              <h2>123</h2>
            </AssistantSidebar>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
}
