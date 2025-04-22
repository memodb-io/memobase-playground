"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    redirectTo: process.env.NEXT_PUBLIC_BASE_URL!,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

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
