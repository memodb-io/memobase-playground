import { create } from "zustand";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  maxConversations: number;
  currentConversations: number;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  signOut: () => Promise<void>;
  updateConversations: (count: number) => void;
  isMaxConversations: () => boolean;
}

const supabase = createClient();

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  maxConversations: 30,
  currentConversations: 0,
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
  updateConversations: (count: number) => set({ currentConversations: count }),
  isMaxConversations: () => {
    const { maxConversations, currentConversations } = get();
    return currentConversations >= maxConversations;
  },
}));
