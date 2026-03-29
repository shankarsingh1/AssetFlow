import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as listingApi from '../api/listingApi.js';
import AssetCard from '../components/AssetCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await listingApi.getListings({
          page,
          limit: 12,
          category: category || undefined,
          sort,
          search: search || undefined,
        });
        if (!cancelled) {
          setListings(data.listings || []);
          setPagination(data.pagination || { page: 1, pages: 1 });
        }
      } catch {
        if (!cancelled) {
          setListings([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, category, sort, search]);

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === '' || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Marketplace</h1>
          <p className="mt-1 text-ink-muted">Search, filter, and collect with credits</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search titles…"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') updateParams({ search: e.target.value, page: 1 });
            }}
            className="input-field max-w-xs"
          />
          <select
            value={category}
            onChange={(e) => updateParams({ category: e.target.value, page: 1 })}
            className="input-field w-auto min-w-[10rem]"
          >
            <option value="">All categories</option>
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="collectible">Collectible</option>
          </select>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
            className="input-field w-auto min-w-[9rem]"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <AssetCard key={l._id} listing={l} />
            ))}
            {!listings.length && (
              <p className="col-span-full text-center text-ink-muted">No listings found.</p>
            )}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateParams({ page: page - 1 })}
                className="rounded-xl border border-line bg-card px-4 py-2 text-sm text-ink shadow-sm transition duration-250 hover:border-primary/30 disabled:opacity-40"
              >
                Prev
              </button>
              <span className="px-3 py-2 text-sm text-ink-muted">
                Page {pagination.page} / {pagination.pages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.pages}
                onClick={() => updateParams({ page: page + 1 })}
                className="rounded-xl border border-line bg-card px-4 py-2 text-sm text-ink shadow-sm transition duration-250 hover:border-primary/30 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
