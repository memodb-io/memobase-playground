"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDeployLastVersion() {
  const supabase = await createClient();
  const res = await supabase.rpc("get_deploy_images_history_like", {
    image_prefix: "ghcr.io/memodb-io/memobase:%",
    n: 1,
  });
  if (!res.error && res.data && res.data[0]) {
    return res.data[0].image as string;
  }
  return "";
}
