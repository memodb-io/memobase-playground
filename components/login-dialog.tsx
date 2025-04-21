"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useLoginDialog } from "@/stores/use-login-dialog";

export function LoginDialog() {
  const t = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, closeDialog } = useLoginDialog();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("loginRequired")}</DialogTitle>
          <DialogDescription>
            {t("loginRequiredDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? t("loggingIn") : t("login")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
