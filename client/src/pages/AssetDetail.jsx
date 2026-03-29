import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as assetApi from '../api/assetApi.js';
import * as listingApi from '../api/listingApi.js';
import { useAuth } from '../hooks/useAuth.js';
import OwnershipHistory from '../components/OwnershipHistory.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatCredits } from '../utils/formatCredits.js';
import { getUserId } from '../utils/getUserId.js';

export default function AssetDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [asset, setAsset] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(25);
  const [listDesc, setListDesc] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const ownerId = asset?.owner_id?._id || asset?.owner_id?.id || asset?.owner_id;
  const isOwner = Boolean(getUserId(user) && ownerId && String(ownerId) === getUserId(user));

  const heroSrc = asset?.thumbnail_url || asset?.file_url;

  async function reload() {
    const { asset: a } = await assetApi.getAsset(id);
    setAsset(a);
    const h = await assetApi.getOwnershipHistory(id);
    setHistory(h);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { asset: a } = await assetApi.getAsset(id);
        if (!cancelled) setAsset(a);
        const h = await assetApi.getOwnershipHistory(id);
        if (!cancelled) setHistory(h);
      } catch {
        if (!cancelled) setAsset(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleList() {
    setBusy(true);
    setMsg('');
    try {
      await listingApi.createListing({
        asset_id: id,
        price_credits: Number(price),
        description: listDesc,
      });
      await reload();
      setMsg('Listed on marketplace.');
    } catch (e) {
      setMsg(e.response?.data?.message || 'Listing failed');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!asset) {
    return <p className="p-8 text-center text-ink-muted">Asset not found.</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md">
          {heroSrc ? (
            <img
              src={heroSrc}
              alt={asset.title}
              className="aspect-[3/4] w-full rounded-2xl border border-line object-cover shadow-card"
            />
          ) : (
            <div className="flex aspect-[3/4] w-full items-center justify-center rounded-2xl border border-line bg-card text-ink-muted shadow-soft">
              No preview
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{asset.title}</h1>
          <p className="mt-2 text-sm uppercase tracking-wide text-ink-muted">{asset.category}</p>
          <p className="mt-4 leading-relaxed text-ink-muted">{asset.description}</p>
          <p className="mt-4 text-sm text-ink-muted">
            Owner{' '}
            <Link to={`/profile/${asset.owner_id?.username}`} className="font-medium text-primary-darker hover:underline">
              @{asset.owner_id?.username}
            </Link>
          </p>
          <p className="text-sm text-ink-muted">
            Creator{' '}
            <Link to={`/profile/${asset.creator_id?.username}`} className="font-medium text-ink hover:underline">
              @{asset.creator_id?.username}
            </Link>
          </p>

          {msg && <p className="mt-4 text-sm font-medium text-primary-darker">{msg}</p>}

          {isOwner && (
            <div className="surface-card mt-8 space-y-6 p-6">
              {asset.status !== 'listed' && (
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">List for sale</h2>
                  <p className="mt-1 text-xs text-ink-muted">
                    Set your price (min 5 credits). Works for new uploads and items you bought — reselling is allowed.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <input
                      type="number"
                      min={5}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="input-field w-28"
                    />
                    <span className="self-center text-sm text-ink-muted">{formatCredits(Number(price) || 0)}</span>
                  </div>
                  <textarea
                    value={listDesc}
                    onChange={(e) => setListDesc(e.target.value)}
                    placeholder="Listing pitch"
                    className="input-field mt-2"
                    rows={2}
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleList}
                    className="btn-primary mt-3 disabled:opacity-50"
                  >
                    Create listing
                  </button>
                </div>
              )}
              {asset.status === 'listed' && (
                <p className="text-sm text-ink-muted">This asset is listed — open it from Dashboard → Your listings.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {history && (
        <div className="mt-12">
          <OwnershipHistory timeline={history.timeline} currentOwner={history.current_owner} />
        </div>
      )}
    </div>
  );
}
