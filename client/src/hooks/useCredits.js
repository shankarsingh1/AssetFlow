import { useCreditStore } from '../store/creditStore.js';

export function useCredits() {
  const balance = useCreditStore((s) => s.balance);
  const lastClaimAt = useCreditStore((s) => s.lastClaimAt);
  const loading = useCreditStore((s) => s.loading);
  const error = useCreditStore((s) => s.error);
  const fetchBalance = useCreditStore((s) => s.fetchBalance);
  const claim = useCreditStore((s) => s.claim);
  const setFromUser = useCreditStore((s) => s.setFromUser);
  const reset = useCreditStore((s) => s.reset);

  return {
    balance,
    lastClaimAt,
    loading,
    error,
    fetchBalance,
    claim,
    setFromUser,
    reset,
  };
}
