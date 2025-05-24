import type { FC } from "react";
import { useEffect, useRef } from "react";
import {
  ThreadListItemPrimitive,
  ThreadListPrimitive,
} from "@assistant-ui/react";
import { useTranslations } from "next-intl";

interface Props {
  onItemClick?: (index: number) => void;
}

export const ThreadList: FC<Props> = (props) => {
  return (
    <ThreadListPrimitive.Root className="flex flex-col items-stretch gap-1.5">
      <ThreadListItems onItemClick={props.onItemClick} />
    </ThreadListPrimitive.Root>
  );
};

const ThreadListItems: FC<Props> = ({ onItemClick }) => {
  return (
    <ThreadListPrimitive.Items
      components={{
        ThreadListItem: (props) => (
          <ThreadListItem {...props} onItemClick={onItemClick} />
        ),
      }}
    />
  );
};

const ThreadListItem: FC<Props> = ({ onItemClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    const index = e.currentTarget.getAttribute("data-index");
    if (index && onItemClick) {
      onItemClick(Number(index));
    }
  };

  useEffect(() => {
    if (ref.current) {
      // 这里你可以在渲染之后，通过 ref.parentNode 查询一下它在列表里的位置
      const parent = ref.current.parentElement;
      if (parent) {
        const children = Array.from(parent.children);
        const index = children.indexOf(ref.current);
        ref.current.setAttribute("data-index", String(index));
      }
    }
  }, []);

  return (
    <ThreadListItemPrimitive.Root
      ref={ref}
      onClick={handleClick}
      className="data-[active]:bg-muted hover:bg-muted focus-visible:bg-muted focus-visible:ring-ring flex items-center gap-2 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2"
    >
      <ThreadListItemPrimitive.Trigger className="flex-grow px-3 py-2 text-start">
        <ThreadListItemTitle />
      </ThreadListItemPrimitive.Trigger>
    </ThreadListItemPrimitive.Root>
  );
};

const ThreadListItemTitle: FC = () => {
  const t = useTranslations("common");
  return (
    <p className="text-sm line-clamp-1 overflow-hidden break-words">
      <ThreadListItemPrimitive.Title fallback={t("thread.newChat")} />
    </p>
  );
};
