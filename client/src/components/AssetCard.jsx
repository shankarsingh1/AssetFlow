import { Link } from 'react-router-dom';
import { formatCredits } from '../utils/formatCredits.js';

export default function AssetCard({ listing }) {
  const asset = listing.asset_id;
  const seller = listing.seller_id;
  const thumb = asset?.thumbnail_url || asset?.title || '/vite.svg';

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="surface-card-hover group flex flex-col rounded-2xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-black/5 dark:bg-white/5">
        {asset?.thumbnail_url ? (
          <img
            src={asset.thumbnail_url}
            alt={asset.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-faint">{thumb}</div>
        )}
        <span className="absolute left-2 top-2 rounded-lg border border-line bg-card px-2 py-0.5 text-xs capitalize text-ink shadow-sm">
          {asset?.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 rounded-b-2xl border-t border-line p-4">
        <h3 className="font-display text-base font-semibold text-ink line-clamp-1">{asset?.title}</h3>
        <p className="text-sm text-ink-muted line-clamp-2">{listing.description || 'No listing notes.'}</p>
        <div className="mt-auto flex items-center justify-between text-sm">
          <span className="text-ink-muted">@{seller?.username}</span>
          <span className="font-semibold text-primary-darker">{formatCredits(listing.price_credits)}</span>
        </div>
      </div>
    </Link>
  );
}
