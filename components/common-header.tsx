"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/user-menu";
import { LangSwitch } from "@/components/lang-switch";
import { Feedback } from "@/components/feedback";

export default function CommonHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex-1 flex items-center gap-2 px-3">
        <SidebarTrigger />
        <div className="flex-1" />
        <Feedback />
        <ThemeToggle />
        <LangSwitch />
        <UserMenu />
      </div>
    </header>
  );
}
