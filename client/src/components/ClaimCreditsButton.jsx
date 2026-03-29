import { useEffect, useState } from 'react';
import { useCredits } from '../hooks/useCredits.js';
import { msUntilUtcMidnight, formatCountdown } from '../utils/timeUntilMidnight.js';
import { formatCredits } from '../utils/formatCredits.js';

const DAILY = Number(import.meta.env.VITE_DAILY_CREDITS) || 50;

export default function ClaimCreditsButton() {
  const { lastClaimAt, claim, loading, error, fetchBalance } = useCredits();
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const last = lastClaimAt ? new Date(lastClaimAt) : null;
  const claimed = last && last >= today;

  const msLeft = claimed ? msUntilUtcMidnight(new Date(now)) : 0;

  async function handleClaim() {
    setBusy(true);
    try {
      await claim();
    } catch {
      await fetchBalance();
    } finally {
      setBusy(false);
    }
  }

  if (claimed) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-ink-muted">Next free claim in</p>
        <p className="mt-1 font-mono text-2xl font-medium text-primary-darker">{formatCountdown(msLeft)}</p>
        <p className="mt-2 text-xs text-ink-faint">Resets at UTC midnight</p>
      </div>
    );
  }

  return (
    <div className="surface-card p-6">
      <p className="text-sm text-ink-muted">Daily bonus</p>
      <button
        type="button"
        disabled={loading || busy}
        onClick={handleClaim}
        className="btn-primary mt-3 w-full disabled:opacity-50"
      >
        {loading || busy ? 'Claiming…' : `Claim ${DAILY} credits ⚡`}
      </button>
      {error && <p className="mt-2 text-xs text-accent">{error}</p>}
    </div>
  );
}
