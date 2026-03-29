import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/** Must match <script> in index.html for FOUC-free default dark. */
export const THEME_STORAGE_KEY = 'assetflow-theme';

export function applyThemeToDocument(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

function readStoredTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return 'dark';
    const parsed = JSON.parse(raw);
    return parsed?.state?.theme === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: readStoredTheme(),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setTheme: (theme) => set({ theme: theme === 'light' ? 'light' : 'dark' }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
