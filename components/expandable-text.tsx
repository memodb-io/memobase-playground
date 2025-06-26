import { useState } from "react";
import classNames from "classnames";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExpandableText({
  text,
  maxLines = 3,
}: {
  text: string;
  maxLines?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  const lineClampClass = !expanded
    ? {
        "line-clamp-1": maxLines === 1,
        "line-clamp-2": maxLines === 2,
        "line-clamp-3": maxLines === 3,
        "line-clamp-4": maxLines === 4,
        "line-clamp-5": maxLines === 5,
        "line-clamp-6": maxLines === 6,
      }
    : {};

  return (
    <div className="flex justify-between">
      <p
        className={classNames(
          "overflow-hidden",
          "break-words",
          "whitespace-pre-line",
          lineClampClass
        )}
      >
        {text}
      </p>
      <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
        {expanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
