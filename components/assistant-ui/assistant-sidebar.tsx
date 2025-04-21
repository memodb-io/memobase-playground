import * as React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { FC, PropsWithChildren } from "react";

import { Thread } from "@/components/assistant-ui/thread";

export const AssistantSidebar: FC<PropsWithChildren> = ({ children }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  if (isMobile) {
    return (
      <>
        <div className="h-[calc(100vh-4rem)]">
          <Thread />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="right" className="w-[300px] p-0">
            {children}
          </SheetContent>
        </Sheet>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-20 right-4 z-50 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
        >
          <Brain className="h-4 w-4" />
        </Button>
      </>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="!h-[calc(100vh-4rem)]"
    >
      <ResizablePanel
        defaultSize={65}
        minSize={30}
        className="min-w-[300px]"
      >
        <Thread />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={35}
        minSize={25}
        className="min-w-[250px]"
      >
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
