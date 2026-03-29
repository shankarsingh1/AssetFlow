import { formatCredits } from '../utils/formatCredits.js';

export default function BuyModal({
  open,
  onClose,
  onConfirm,
  listing,
  userBalance,
  loading,
}) {
  if (!open || !listing) return null;

  const price = listing.price_credits;
  const fee = Math.floor(price * 0.05);
  const sellerReceives = price - fee;
  const after = (userBalance ?? 0) - price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="surface-card w-full max-w-md p-8 shadow-card-lg"
      >
        <h2 className="font-display text-xl font-semibold text-ink">Confirm purchase</h2>
        <p className="mt-2 text-sm text-ink-muted">
          You are about to buy <span className="font-medium text-ink">{listing.asset_id?.title}</span> from @
          {listing.seller_id?.username}.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-ink">
          <li className="flex justify-between">
            <span className="text-ink-muted">Price</span>
            <span className="font-medium">{formatCredits(price)}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-ink-muted">Platform fee (5%)</span>
            <span>{formatCredits(fee)}</span>
          </li>
          <li className="flex justify-between text-ink-muted">
            <span>Seller receives</span>
            <span>{formatCredits(sellerReceives)}</span>
          </li>
          <li className="flex justify-between border-t border-line pt-2 font-semibold">
            <span>Your balance after</span>
            <span className={after < 0 ? 'text-accent' : 'text-primary-darker'}>{formatCredits(after)}</span>
          </li>
        </ul>
        {after < 0 && <p className="mt-3 text-sm text-accent">Not enough credits.</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-card px-4 py-2 text-sm text-ink-muted shadow-sm transition duration-250 hover:border-primary/35"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading || after < 0}
            onClick={onConfirm}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-soft transition duration-250 hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? 'Processing…' : 'Buy now'}
          </button>
        </div>
      </div>
    </div>
  );
}
