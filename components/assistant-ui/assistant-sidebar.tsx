import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { FC, PropsWithChildren } from "react";

import { Thread } from "@/components/assistant-ui/thread";

export const AssistantSidebar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={75}>
        <Thread />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={25}>{children}</ResizablePanel>
    </ResizablePanelGroup>
  );
};
