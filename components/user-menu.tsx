"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useUserStore } from "@/stores/user";
import Link from "next/link";
import Image from "next/image";

export function UserMenu() {
  const t = useTranslations("common");
  const { user, loading, signOut } = useUserStore();

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />;
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/login">{t("login")}</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">{t("signup")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          {user.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt={String(user.email)}
              width={32}
              height={32}
              unoptimized
              className="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              {user.email?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex flex-col items-start">
          <div className="text-sm font-medium">{user.email}</div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
