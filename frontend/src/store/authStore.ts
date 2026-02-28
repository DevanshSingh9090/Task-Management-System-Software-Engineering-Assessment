import { create } from 'zustand';

type User = { id: number; email: string; name?: string } | null;

type State = {
  user: User;
  setUser: (u: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<State>((set) => ({
  user: null,
  setUser: (u) => set({ user: u }),
  clearUser: () => set({ user: null }),
}));