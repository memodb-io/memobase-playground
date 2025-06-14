"use client";

import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTranslations } from "next-intl";

import { RefreshCw, ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";

import { UserProfile, UserEvent } from "@memobase/memobase";

import { getTopicIcon } from "@/components/icons/topic-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimelineLayout } from "@/components/timeline/timeline-layout";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useIsMobile } from "@/hooks/use-mobile";

import {
  addProfile,
  deleteProfile,
  updateProfile,
} from "@/api/models/memobase";

import { toast } from "sonner";

export function UserMemory({
  isLoading,
  profiles,
  events,
  badge,
  onRefresh,
  profilesFold,
  canAdd,
  canEdit,
  canDelete,
}: {
  isLoading: boolean;
  profiles: UserProfile[];
  events: UserEvent[];
  badge?: string;
  onRefresh?: () => void;
  profilesFold?: boolean;
  canAdd?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const t = useTranslations("common");
  const isMobile = useIsMobile();

  const [foldStatus, setFoldStatus] = useState<Record<string, boolean>>({});

  const form = useForm<UserProfile>({
    resolver: zodResolver(UserProfile),
  });

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
              {canAdd && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() =>
                        form.reset({
                          topic: "",
                          sub_topic: "",
                          content: "",
                        })
                      }
                      className="w-full"
                      size="sm"
                    >
                      +
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle></AlertDialogTitle>
                      <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>

                    <Form {...form}>
                      <form className="space-y-4">
                        <FormField
                          control={form.control}
                          name="topic"
                          render={({ field }) => (
                            <div>
                              <FormLabel>{t("topic")}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="sub_topic"
                          render={({ field }) => (
                            <div>
                              <FormLabel>{t("sub_topic")}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <div>
                              <FormLabel>{t("content")}</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </div>
                          )}
                        />
                      </form>
                    </Form>

                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const { content, topic, sub_topic } =
                            form.getValues();
                          if (!content || !topic || !sub_topic) {
                            toast.error(t("error_empty_fields"));
                            return;
                          }
                          await addProfile(content, topic, sub_topic).then(
                            () => {
                              onRefresh?.();
                            }
                          );
                        }}
                      >
                        {t("submit")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
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
                                  className="border-b pb-4 last:pb-0 last:border-b-0 group/profile"
                                >
                                  <div className="font-medium text-sm text-muted-foreground mb-1 flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {profile.sub_topic}
                                    <div className="ml-auto">
                                      {canEdit && (
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="group-hover/profile:opacity-100 opacity-0 transition-opacity duration-200"
                                              onClick={() => {
                                                form.reset(profile);
                                              }}
                                            >
                                              <Pencil className="w-4 h-4" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle></AlertDialogTitle>
                                              <AlertDialogDescription></AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <Form {...form}>
                                              <form className="space-y-4">
                                                <FormField
                                                  control={form.control}
                                                  name="topic"
                                                  render={({ field }) => (
                                                    <div>
                                                      <FormLabel>
                                                        {t("topic")}
                                                      </FormLabel>
                                                      <FormControl>
                                                        <Input {...field} />
                                                      </FormControl>
                                                      <FormMessage />
                                                    </div>
                                                  )}
                                                />
                                                <FormField
                                                  control={form.control}
                                                  name="sub_topic"
                                                  render={({ field }) => (
                                                    <div>
                                                      <FormLabel>
                                                        {t("sub_topic")}
                                                      </FormLabel>
                                                      <FormControl>
                                                        <Input {...field} />
                                                      </FormControl>
                                                      <FormMessage />
                                                    </div>
                                                  )}
                                                />
                                                <FormField
                                                  control={form.control}
                                                  name="content"
                                                  render={({ field }) => (
                                                    <div>
                                                      <FormLabel>
                                                        {t("content")}
                                                      </FormLabel>
                                                      <FormControl>
                                                        <Textarea {...field} />
                                                      </FormControl>
                                                      <FormMessage />
                                                    </div>
                                                  )}
                                                />
                                              </form>
                                            </Form>

                                            <AlertDialogFooter>
                                              <AlertDialogCancel>
                                                {t("cancel")}
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={async () => {
                                                  const {
                                                    id,
                                                    content,
                                                    topic,
                                                    sub_topic,
                                                  } = form.getValues();
                                                  if (
                                                    !id ||
                                                    !content ||
                                                    !topic ||
                                                    !sub_topic
                                                  ) {
                                                    toast.error(
                                                      t("error_empty_fields")
                                                    );
                                                    return;
                                                  }
                                                  await updateProfile(
                                                    id,
                                                    content,
                                                    topic,
                                                    sub_topic
                                                  ).then(() => {
                                                    onRefresh?.();
                                                  });
                                                }}
                                              >
                                                {t("submit")}
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                      {canDelete && (
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="group-hover/profile:opacity-100 opacity-0 transition-opacity duration-200"
                                            >
                                              <Trash className="w-4 h-4 text-red-500" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>
                                                {t("delete_profile_title")}
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                {t(
                                                  "delete_profile_description"
                                                )}
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>
                                                {t("cancel")}
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={async () => {
                                                  await deleteProfile(
                                                    profile.id
                                                  ).then(() => {
                                                    onRefresh?.();
                                                  });
                                                }}
                                              >
                                                {t("delete")}
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      )}
                                    </div>
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
