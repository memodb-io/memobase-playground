import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";

import Image from "next/image";
import Link from "next/link";

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  className="rounded"
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo.png`}
                  alt="Memobase logo"
                  width={38}
                  height={38}
                  priority
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Memobase</span>
                  <span className=""></span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>{children}</SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
