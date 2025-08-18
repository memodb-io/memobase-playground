import * as React from "react";

import { Layers, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { getDeployLastVersion } from "@/lib/get-deploy";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [deploy, setDeploy] = React.useState<string>("");
  const deployVersion = React.useMemo(() => {
    const [tag, sha] = deploy.split(":");

    return sha ? "v" + sha : tag;
  }, [deploy]);

  React.useEffect(() => {
    (async () => {
      const image = await getDeployLastVersion();
      setDeploy(image);
    })();
  }, []);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {!!deploy && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="sm">
                <a href="https://github.com/memodb-io/memobase/pkgs/container/memobase">
                  <Layers />
                  <span>Deploy</span>
                  <Badge variant="outline" className="ml-auto">
                    {deployVersion}
                  </Badge>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url} target="_blank">
                  <item.icon />
                  <span>{item.title}</span>
                  <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
