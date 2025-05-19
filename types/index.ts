import { ReactNode } from "react";
import { UserProfile, UserEvent } from "@memobase/memobase";

export type TimelineSize = "sm" | "md" | "lg";
export type TimelineStatus = "completed" | "in-progress" | "pending";
export type TimelineColor =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "destructive";

export interface TimelineElement {
  id: number;
  date: string;
  title: string;
  description: string;
  icon?: ReactNode | (() => ReactNode);
  status?: TimelineStatus;
  color?: TimelineColor;
  size?: TimelineSize;
  loading?: boolean;
  error?: string;
}

export interface TimelineProps {
  items: TimelineElement[];
  size?: TimelineSize;
  animate?: boolean;
  iconColor?: TimelineColor;
  connectorColor?: TimelineColor;
  className?: string;
}

export interface ThreadExample {
  id: string;
  desc: string;
  tags: string[];
  citation: {
    name: string;
    url: string;
  }
}

export interface MemoryExample {
  id: string;
  thread_id: string;
  profiles: UserProfile[];
  events: UserEvent[];
  created_at: string;
  updated_at: string;
}
