"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { toast } from "sonner";
import { sendFeedback } from "@/api/models/feedback";

export function Feedback() {
  const t = useTranslations("feedback");
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState<"issue" | "idea">("issue");
  const [content, setContent] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error(t("emptyContent") || "Content cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await sendFeedback(type, content.trim());
      if (res.code !== 0) throw res.message;
      toast.success(t("successMsg"));
      setContent("");
      setOpen(false);
    } catch {
      toast.error(t("errorMsg") || "Failed to send feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          {t("feedbackBtn")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-4">
            <DialogTitle>{t("feedbackBtn")}</DialogTitle>
            <DialogDescription>{t("feedbackDesc")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Type</Label>
              <ToggleGroup
                type="single"
                variant="outline"
                className="w-full"
                value={type}
                onValueChange={(val) => {
                  if (val) setType(val as "issue" | "idea");
                }}
              >
                <ToggleGroupItem value="issue">{t("issue")}</ToggleGroupItem>
                <ToggleGroupItem value="idea">{t("idea")}</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="feedback-content">{t("contentLabel")}</Label>
              <Textarea
                id="feedback-content"
                placeholder={t("placeholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={loading}>
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading || !content}>
              {loading ? t("sending") : t("send")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
