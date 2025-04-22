import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => Promise<void>;
}

const supabase = createClient();

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "登出失败" });
    } finally {
      set({ loading: false });
    }
  },
}));
