import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as authApi from '../api/authApi.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: ({ user, accessToken }) =>
        set({
          user,
          accessToken,
          isAuthenticated: Boolean(accessToken),
        }),

      setAccessToken: (accessToken) =>
        set({
          accessToken,
          isAuthenticated: Boolean(accessToken),
        }),

      setUser: (user) => set({ user }),

      logoutLocal: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          /* ignore */
        }
        get().logoutLocal();
      },
    }),
    {
      name: 'assetflow-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
