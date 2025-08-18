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
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { Button } from "@/components/ui/button";
import { NavSecondary } from "@/components/nav-secondary";

import { List, ChartColumnBig } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

export function AppSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { open, toggleSidebar } = useSidebar();

  const data = {
    navSecondary: [
      {
        title: "Status",
        url: "https://status.memobase.io/",
        icon: ChartColumnBig,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                {open ? (
                  <Image
                    src="https://assets.memodb.io/memobase_logo-light.jpg"
                    alt="Memobase logo"
                    width={142}
                    height={32}
                    unoptimized
                    className="object-cover rounded-sm"
                  />
                ) : (
                  <Image
                    className="rounded"
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/logo.png`}
                    alt="Memobase logo"
                    width={38}
                    height={38}
                    priority
                  />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavMain />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {open ? (
            <>{children}</>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toggleSidebar();
              }}
            >
              <List />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          )}
        </SidebarGroup>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
