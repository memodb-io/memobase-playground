"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";

import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { AssistantSidebar } from "@/components/assistant-ui/assistant-sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Thread } from "@/components/assistant-ui/config-tool-thread";

import CommonHeader from "@/components/common-header";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useLoginDialog } from "@/stores/use-login-dialog";

export default function Page() {
  const t = useTranslations("common");
  const { openDialog } = useLoginDialog();

  const runtime = useChatRuntime({
    api: `${process.env["NEXT_PUBLIC_BASE_PATH"] || ""}/api/config-tool`,
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

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <CommonHeader />
          <AssistantSidebar threadSlot={<Thread />} />
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
}
