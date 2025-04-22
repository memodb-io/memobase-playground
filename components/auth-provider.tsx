"use client";

import { useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/stores/user";
import { useSearchParams } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, loading } = useUserStore();
  const searchParams = useSearchParams();

  const checkUser = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      setUser(data.user);
    }
    setLoading(false);
  }, [setUser, setLoading]);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  useEffect(() => {
    const auth = searchParams.get("auth");
    if (auth === "success") {
      checkUser();
    }
  }, [searchParams, checkUser]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-gray-900 dark:border-white" />
      </div>
    );
  }
  return <>{children}</>;
}
