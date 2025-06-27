import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { FC, PropsWithChildren, ReactNode } from "react";

interface AssistantSidebarProps extends PropsWithChildren {
  threadSlot?: ReactNode;
}

export const AssistantSidebar: FC<AssistantSidebarProps> = ({
  children,
  threadSlot,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <div className="h-[calc(100dvh-4rem)]">{threadSlot}</div>
        {children && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed top-20 right-4 z-50 rounded-full shadow-lg"
              >
                <Brain className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetHeader className="hidden">
              <SheetTitle>Assistant</SheetTitle>
              <SheetDescription>Assistant</SheetDescription>
            </SheetHeader>

            <SheetContent side="right" className="p-0">
              {children}
            </SheetContent>
          </Sheet>
        )}
      </>
    );
  }

  return (
    <>
      {children ? (
        <ResizablePanelGroup
          direction="horizontal"
          className="!h-[calc(100dvh-4rem)]"
        >
          <ResizablePanel defaultSize={70} minSize={30}>
            {threadSlot}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="h-[calc(100dvh-4rem)]">{threadSlot}</div>
      )}
    </>
  );
};
