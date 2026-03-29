import { create } from 'zustand';
import * as creditApi from '../api/creditApi.js';
import { useAuthStore } from './authStore.js';

export const useCreditStore = create((set, get) => ({
  balance: null,
  lastClaimAt: null,
  loading: false,
  error: null,

  setFromUser: (user) => {
    if (user && typeof user.credits_balance === 'number') {
      set({ balance: user.credits_balance, lastClaimAt: user.last_claim_at ?? null });
    }
  },

  fetchBalance: async () => {
    if (!useAuthStore.getState().isAuthenticated) return;
    set({ loading: true, error: null });
    try {
      const data = await creditApi.getBalance();
      set({
        balance: data.balance,
        lastClaimAt: data.last_claim_at,
        loading: false,
      });
    } catch (e) {
      set({
        error: e.response?.data?.message || 'Could not load credits',
        loading: false,
      });
    }
  },

  claim: async () => {
    set({ loading: true, error: null });
    try {
      const data = await creditApi.claimCredits();
      set({
        balance: data.new_balance,
        lastClaimAt: new Date().toISOString(),
        loading: false,
      });
      const u = useAuthStore.getState().user;
      if (u) {
        useAuthStore.getState().setUser({ ...u, credits_balance: data.new_balance });
      }
      return data;
    } catch (e) {
      const msg = e.response?.data?.message || 'Claim failed';
      set({ error: msg, loading: false });
      throw e;
    }
  },

  reset: () => set({ balance: null, lastClaimAt: null, loading: false, error: null }),
}));
