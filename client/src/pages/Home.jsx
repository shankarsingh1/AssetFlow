import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as listingApi from '../api/listingApi.js';
import AssetCard from '../components/AssetCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listingApi.getListings({ limit: 6, page: 1 });
        if (!cancelled) setListings(data.listings || []);
      } catch {
        if (!cancelled) setListings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <section className="surface-card relative p-10 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-primary-darker">Credit economy</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
            Trade digital assets with style
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            Upload, collect, and sell art, music, and collectibles on a credit-based marketplace — claim free
            credits daily.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/marketplace"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition duration-250 hover:bg-primary-dark"
            >
              Browse marketplace
            </Link>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="rounded-xl border border-line bg-card px-5 py-3 text-sm font-semibold text-ink shadow-sm transition duration-250 hover:border-primary/40"
              >
                Go to dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                className="rounded-xl border border-line bg-card px-5 py-3 text-sm font-semibold text-ink shadow-sm transition duration-250 hover:border-primary/40"
              >
                Create account
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Featured listings</h2>
            <p className="text-sm text-ink-muted">Fresh drops from the community</p>
          </div>
          <Link to="/marketplace" className="text-sm font-medium text-primary-darker hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
              <AssetCard key={l._id} listing={l} />
            ))}
            {!listings.length && (
              <p className="col-span-full text-center text-ink-muted">No listings yet — be the first to sell.</p>
            )}
          </div>
        )}
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { title: 'Art', cat: 'art', desc: 'Illustrations, renders, visual stories.' },
          { title: 'Music', cat: 'music', desc: 'Stems, loops, cover art bundles.' },
          { title: 'Collectibles', cat: 'collectible', desc: 'Limited drops and digital keepsakes.' },
        ].map((c) => (
          <Link
            key={c.cat}
            to={`/marketplace?category=${c.cat}`}
            className="surface-card-hover p-6"
          >
            <h3 className="font-display text-lg font-semibold text-ink">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{c.desc}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
