import { formatCredits } from '../utils/formatCredits.js';
import { useCredits } from '../hooks/useCredits.js';

export default function CreditBadge({ className = '' }) {
  const { balance } = useCredits();
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line bg-card px-3 py-1 text-sm font-medium text-ink shadow-sm ${className}`}
      title="Credit balance"
    >
      {formatCredits(balance)}
    </span>
  );
}
