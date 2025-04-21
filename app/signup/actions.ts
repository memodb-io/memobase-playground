"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const payload = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL!}/auth/confirm`,
  };

  const { error, data } = await supabase.auth.signUp(payload);

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  if (data.user?.identities?.length === 0) {
    redirect(
      `/login?message=${encodeURIComponent("该邮箱已被注册，请直接登录")}`
    );
  }

  redirect(`/login?message=${encodeURIComponent("请检查您的邮箱并完成验证")}`);
}
