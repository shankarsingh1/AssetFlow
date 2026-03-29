import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as userApi from '../api/userApi.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function Profile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await userApi.getPublicProfile(username);
        if (!cancelled) setData(res);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data?.user) {
    return <p className="p-8 text-center text-ink-muted">User not found.</p>;
  }

  const { user, created, owned } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="surface-card flex flex-wrap items-center gap-6 p-8">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt=""
            className="h-24 w-24 rounded-2xl border border-line object-cover shadow-soft"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-line bg-card text-2xl font-semibold text-ink-muted shadow-sm">
            {user.username?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">@{user.username}</h1>
          {user.bio && <p className="mt-2 max-w-xl leading-relaxed text-ink-muted">{user.bio}</p>}
        </div>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink">Created</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(created || []).map((a) => (
            <Link key={a._id} to={`/assets/${a._id}`} className="surface-card-hover rounded-2xl">
              <div className="aspect-video overflow-hidden rounded-t-2xl bg-black/5 dark:bg-white/5">
                {a.thumbnail_url ? (
                  <img src={a.thumbnail_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-ink-faint">—</div>
                )}
              </div>
              <p className="rounded-b-2xl border-t border-line p-3 text-sm font-medium text-ink line-clamp-1">
                {a.title}
              </p>
            </Link>
          ))}
          {!created?.length && <p className="text-ink-muted">No public creations.</p>}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold text-ink">Owned</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(owned || []).map((a) => (
            <Link key={a._id} to={`/assets/${a._id}`} className="surface-card-hover rounded-2xl">
              <div className="aspect-video overflow-hidden rounded-t-2xl bg-black/5 dark:bg-white/5">
                {a.thumbnail_url ? (
                  <img src={a.thumbnail_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-ink-faint">—</div>
                )}
              </div>
              <p className="rounded-b-2xl border-t border-line p-3 text-sm font-medium text-ink line-clamp-1">
                {a.title}
              </p>
            </Link>
          ))}
          {!owned?.length && <p className="text-ink-muted">No owned assets.</p>}
        </div>
      </section>
    </div>
  );
}
