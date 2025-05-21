"use client";

import { useState, useEffect } from "react";

import { useTranslations } from "next-intl";

import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

import { UserProfile, UserEvent } from "@memobase/memobase";

import { getTopicIcon } from "@/components/icons/topic-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineLayout } from "@/components/timeline/timeline-layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { useIsMobile } from "@/hooks/use-mobile";

export function UserMemory({
  isLoading,
  profiles,
  events,
  badge,
  onRefresh,
  profilesFold,
}: {
  isLoading: boolean;
  profiles: UserProfile[];
  events: UserEvent[];
  badge?: string;
  onRefresh?: () => void;
  profilesFold?: boolean;
}) {
  const t = useTranslations("common");
  const isMobile = useIsMobile();

  const [foldStatus, setFoldStatus] = useState<Record<string, boolean>>({});

  const groupedProfiles = profiles.reduce((acc, profile) => {
    if (!acc[profile.topic]) {
      acc[profile.topic] = [];
    }
    acc[profile.topic].push(profile);
    return acc;
  }, {} as Record<string, UserProfile[]>);

  const toggleFold = (topic: string) => {
    setFoldStatus((prev) => ({
      ...prev,
      [topic]: !prev[topic],
    }));
  };

  useEffect(() => {
    const grouped = profiles.reduce((acc, profile) => {
      if (!acc.includes(profile.topic)) {
        acc.push(profile.topic);
      }
      return acc;
    }, [] as string[]);

    const newStatus: Record<string, boolean> = {};
    for (const topic of grouped) {
      newStatus[topic] = !profilesFold;
    }
    setFoldStatus(newStatus);
  }, [profiles, profilesFold]);

  return (
    <div className="h-full pt-2 px-2 md:pt-4 md:px-4">
      <p className="text-lg font-semibold text-foreground mb-4">
        {t("memory_section_title")}
        {badge && <Badge className="ml-2">{badge}</Badge>}
      </p>
      <Tabs defaultValue="profiles" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="profiles">{t("memories")}</TabsTrigger>
            <TabsTrigger value="events">{t("events")}</TabsTrigger>
          </TabsList>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 ${
                isLoading ? "animate-spin" : ""
              }`}
              disabled={isLoading}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
        <TabsContent value="profiles">
          {isLoading ? (
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          ) : (
            <>
              {profiles.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {t("noContent")}
                </div>
              ) : (
                <div
                  className={`grid gap-4 overflow-y-auto py-2 ${
                    isMobile
                      ? "max-h-[calc(100dvh-7rem)]"
                      : "max-h-[calc(100dvh-13rem)]"
                  }`}
                >
                  {Object.entries(groupedProfiles).map(([topic, profiles]) => (
                    <Card key={topic}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          {topic}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFold(topic)}
                          >
                            {foldStatus[topic] ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      {foldStatus[topic] && (
                        <CardContent>
                          <div className="space-y-4">
                            {profiles.map((profile) => {
                              const Icon = getTopicIcon(profile.sub_topic);
                              return (
                                <div
                                  key={profile.id}
                                  className="border-b pb-4 last:pb-0 last:border-b-0"
                                >
                                  <div className="font-medium text-sm text-muted-foreground mb-1 flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {profile.sub_topic}
                                  </div>
                                  <div className="text-sm">
                                    {profile.content}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-2">
                                    {new Date(
                                      profile.created_at
                                    ).toLocaleString()}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="events">
          <div
            className={`overflow-y-auto ${
              isMobile
                ? "max-h-[calc(100dvh-7rem)]"
                : "max-h-[calc(100dvh-13rem)]"
            }`}
          >
            <TimelineLayout
              items={events.flatMap((event) => {
                const deltas = event.event_data?.profile_delta || [];
                return deltas.map((delta) => {
                  const topic = delta.attributes?.topic || "default";
                  const subTopic = delta.attributes?.sub_topic || "default";
                  const Icon = getTopicIcon(subTopic);

                  return {
                    id: parseInt(event.id),
                    date: new Date(event.created_at).toLocaleString(),
                    title: `${topic} - ${subTopic}`,
                    description: delta.content || t("noContent"),
                    color: "primary",
                    icon: <Icon className="w-4 h-4" />,
                  };
                });
              })}
              size="sm"
              animate={true}
              loading={isLoading}
              emptyText={t("noContent")}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
