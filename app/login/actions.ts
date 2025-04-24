"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/?auth=success");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        process.env.NEXT_PUBLIC_BASE_URL! + process.env.NEXT_PUBLIC_BASE_PATH ||
        "",
    },
  });

  if (error) {
    redirect("/error");
  }

  redirect(data.url);
}

export async function signInWithGithub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo:
        process.env.NEXT_PUBLIC_BASE_URL! + process.env.NEXT_PUBLIC_BASE_PATH ||
        "",
    },
  });

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  redirect(data.url);
}

export async function handleGoogleCallback() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function handleGithubCallback() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
