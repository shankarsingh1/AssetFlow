import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as listingApi from '../api/listingApi.js';
import * as assetApi from '../api/assetApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { useCredits } from '../hooks/useCredits.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import BuyModal from '../components/BuyModal.jsx';
import OwnershipHistory from '../components/OwnershipHistory.jsx';
import { formatCredits } from '../utils/formatCredits.js';
import { getUserId } from '../utils/getUserId.js';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { balance, fetchBalance, setFromUser } = useCredits();
  const [listing, setListing] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buyOpen, setBuyOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await listingApi.getListing(id);
        if (!cancelled) setListing(data.listing);
        const aid = data.listing?.asset_id?._id || data.listing?.asset_id;
        if (aid) {
          const [full, h] = await Promise.all([
            assetApi.getAsset(aid),
            assetApi.getOwnershipHistory(aid),
          ]);
          if (!cancelled && full?.asset) {
            setListing((prev) =>
              prev
                ? {
                    ...prev,
                    asset_id: { ...prev.asset_id, ...full.asset },
                  }
                : prev
            );
          }
          if (!cancelled) setHistory(h);
        }
      } catch {
        if (!cancelled) setListing(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleBuy() {
    setBuying(true);
    setError('');
    try {
      const res = await listingApi.buyListing(id);
      setFromUser({ credits_balance: res.buyer_new_balance });
      await fetchBalance();
      setBuyOpen(false);
      navigate(`/assets/${res.asset?._id || listing.asset_id?._id}`);
    } catch (e) {
      setError(e.response?.data?.message || 'Purchase failed');
    } finally {
      setBuying(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!listing) {
    return <p className="p-8 text-center text-ink-muted">Listing not found.</p>;
  }

  const asset = listing.asset_id;
  const seller = listing.seller_id;
  const sellerId = seller?._id || seller?.id || seller;
  const uid = getUserId(user);
  const isOwner = Boolean(uid && sellerId && String(sellerId) === uid);
  const canBuy = isAuthenticated && listing.status === 'active' && !isOwner && Boolean(uid);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md">
          {asset?.thumbnail_url || asset?.file_url ? (
            <img
              src={asset?.thumbnail_url || asset?.file_url}
              alt={asset?.title || ''}
              className="aspect-[3/4] w-full rounded-2xl border border-line object-cover shadow-card"
            />
          ) : (
            <div className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl border border-line bg-card text-ink-muted shadow-soft">
              No preview
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary-darker">{asset?.category}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{asset?.title}</h1>
          <p className="mt-4 leading-relaxed text-ink-muted">{listing.description || asset?.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div>
              <p className="text-xs text-ink-faint">Price</p>
              <p className="text-2xl font-semibold text-primary-darker">{formatCredits(listing.price_credits)}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Seller</p>
              <Link to={`/profile/${seller?.username}`} className="font-medium text-ink hover:text-primary-darker">
                @{seller?.username}
              </Link>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Status</p>
              <p className="capitalize text-ink-muted">{listing.status}</p>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-accent">{error}</p>}

          {canBuy && (
            <button
              type="button"
              onClick={() => setBuyOpen(true)}
              className="btn-accent mt-8 w-full py-3"
            >
              Buy with credits
            </button>
          )}
          {isOwner && listing.status === 'active' && (
            <p className="mt-6 text-sm text-ink-muted">This is your listing.</p>
          )}
        </div>
      </div>

      {history && (
        <div className="mt-12">
          <OwnershipHistory timeline={history.timeline} currentOwner={history.current_owner} />
        </div>
      )}

      <BuyModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
        onConfirm={handleBuy}
        listing={listing}
        userBalance={balance}
        loading={buying}
      />
    </div>
  );
}
