import { formatCredits } from '../utils/formatCredits.js';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString();
}

export default function OwnershipHistory({ timeline, currentOwner }) {
  if (!timeline?.length) return null;

  return (
    <div className="surface-card p-6">
      <h3 className="font-display text-lg font-semibold text-ink">Ownership history</h3>
      <ol className="relative mt-4 space-y-4 border-l border-line pl-4">
        {timeline.map((item, idx) => (
          <li key={idx} className="relative">
            <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary shadow-soft" />
            {item.type === 'created' && (
              <div>
                <p className="text-sm font-medium text-ink">Minted / created</p>
                <p className="text-xs text-ink-faint">{formatDate(item.at)}</p>
                <p className="text-sm text-ink-muted">by @{item.user?.username}</p>
              </div>
            )}
            {item.type === 'sale' && (
              <div>
                <p className="text-sm font-medium text-ink">Sale</p>
                <p className="text-xs text-ink-faint">{formatDate(item.at)}</p>
                <p className="text-sm text-ink-muted">
                  @{item.from?.username} → @{item.to?.username} · {formatCredits(item.price_credits)} · fee{' '}
                  {formatCredits(item.fee_credits)}
                </p>
              </div>
            )}
          </li>
        ))}
      </ol>
      {currentOwner && (
        <p className="mt-4 text-sm text-ink-muted">
          Current owner: <span className="font-medium text-ink">@{currentOwner.username}</span>
        </p>
      )}
    </div>
  );
}
