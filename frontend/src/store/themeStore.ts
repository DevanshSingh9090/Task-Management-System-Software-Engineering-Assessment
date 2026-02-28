import { create } from 'zustand';

type ThemeState = {
  dark: boolean;
  toggle: () => void;
  init: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  dark: false,
  toggle: () => {
    const next = !get().dark;
    set({ dark: next });
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  },
  init: () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    set({ dark: isDark });
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  },
}));