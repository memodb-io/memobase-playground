"use client";

import { useTranslations } from "next-intl";

import { RefreshCw } from "lucide-react";

import { UserProfile, UserEvent } from "@memobase/memobase";

import { getTopicIcon } from "@/components/icons/topic-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineLayout } from "@/components/timeline/timeline-layout";
import { Badge } from "@/components/ui/badge";

export function UserMemory({
  isLoading,
  profiles,
  events,
  badge,
  onRefresh,
}: {
  isLoading: boolean;
  profiles: UserProfile[];
  events: UserEvent[];
  badge?: string;
  onRefresh?: () => void;
}) {
  const t = useTranslations("common");

  const groupedProfiles = profiles.reduce((acc, profile) => {
    if (!acc[profile.topic]) {
      acc[profile.topic] = [];
    }
    acc[profile.topic].push(profile);
    return acc;
  }, {} as Record<string, UserProfile[]>);

  return (
    <div className="pt-0 px-2 md:pt-4 md:px-4">
      <p className="text-lg font-semibold text-foreground mt-2 mb-4">
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
          {profiles.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {t("noContent")}
            </div>
          ) : (
            <div className="grid gap-4 overflow-y-auto max-h-[calc(100dvh-10rem)]">
              {Object.entries(groupedProfiles).map(([topic, profiles]) => (
                <Card key={topic}>
                  <CardHeader>
                    <CardTitle>{topic}</CardTitle>
                  </CardHeader>
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
                            <div className="text-sm">{profile.content}</div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {new Date(profile.created_at).toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="events">
          <div className="overflow-y-auto max-h-[calc(100dvh-10rem)]">
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
