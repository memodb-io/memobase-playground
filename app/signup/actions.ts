"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const t = await getTranslations("common");

  const { error, data } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  if (data.user?.identities?.length === 0) {
    redirect(
      `/login?message=${encodeURIComponent(t("emailAlreadyRegistered"))}`
    );
  }

  redirect(
    `/login?message=${encodeURIComponent(t("checkEmailForVerification"))}`
  );
}
