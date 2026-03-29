import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as assetApi from '../api/assetApi.js';
import * as listingApi from '../api/listingApi.js';
import ClaimCreditsButton from '../components/ClaimCreditsButton.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useCredits } from '../hooks/useCredits.js';
import { formatCredits } from '../utils/formatCredits.js';
import { getUserId } from '../utils/getUserId.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const { balance, fetchBalance, setFromUser } = useCredits();
  const [assets, setAssets] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    if (!isAuthenticated) {
      setAssets([]);
      setListings([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await fetchBalance();
    } catch {
      /* balance optional; continue */
    }

    try {
      const mine = await assetApi.getMyAssets();
      setAssets(mine.assets || []);
    } catch {
      setAssets([]);
    }

    try {
      const { listings: myListings } = await listingApi.getMyListings();
      setListings(myListings || []);
    } catch {
      setListings([]);
    }

    setLoading(false);
  }, [isAuthenticated, fetchBalance]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, location.key]);

  useEffect(() => {
    if (user) setFromUser(user);
  }, [user, setFromUser]);

  const uid = getUserId(user);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-ink-muted">Credits, inventory, and active listings</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="surface-card p-8">
          <p className="text-sm text-ink-muted">Balance</p>
          <p className="mt-2 font-display text-4xl font-semibold text-primary-darker">{formatCredits(balance)}</p>
        </div>
        <ClaimCreditsButton />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">Your listings</h2>
            <p className="mb-2 text-sm text-ink-muted">
              Active marketplace listings only — unlisted uploads appear under Owned assets
            </p>
            <div className="mt-4 space-y-3">
              {listings.map((l) => (
                <div
                  key={l._id}
                  className="surface-card flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div>
                    <Link to={`/listings/${l._id}`} className="font-medium text-ink hover:text-primary-darker">
                      {l.asset_id?.title}
                    </Link>
                    <p className="text-sm text-ink-muted">{formatCredits(l.price_credits)}</p>
                  </div>
                  <Link to={`/assets/${l.asset_id?._id}`} className="text-sm font-medium text-primary-darker hover:underline">
                    Manage asset
                  </Link>
                </div>
              ))}
              {!listings.length && <p className="text-ink-muted">No active listings.</p>}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">Owned assets</h2>
            <p className="mb-2 text-sm text-ink-muted">Everything you created or bought (listed or not)</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((a) => (
                <Link
                  key={a._id}
                  to={`/assets/${a._id}`}
                  className="surface-card-hover rounded-2xl"
                >
                  <div className="aspect-video overflow-hidden rounded-t-2xl bg-black/5 dark:bg-white/5">
                    {a.thumbnail_url ? (
                      <img src={a.thumbnail_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-ink-faint">No thumb</div>
                    )}
                  </div>
                  <div className="rounded-b-2xl border-t border-line p-3">
                    <p className="font-medium text-ink line-clamp-1">{a.title}</p>
                    <p className="text-xs capitalize text-ink-muted">{a.status}</p>
                  </div>
                </Link>
              ))}
              {!assets.length && (
                <p className="col-span-full text-ink-muted">
                  {uid
                    ? 'No owned assets yet — upload from Upload or buy on the marketplace.'
                    : 'Sign in to see your assets.'}
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
