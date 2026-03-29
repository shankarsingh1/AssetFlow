import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as transactionApi from '../api/transactionApi.js';
import { useAuth } from '../hooks/useAuth.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { formatCredits } from '../utils/formatCredits.js';
import { getUserId } from '../utils/getUserId.js';

export default function Transactions() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const uid = getUserId(user);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await transactionApi.getMyTransactions({ limit: 50, page: 1 });
        if (!cancelled) setRows(data.transactions || []);
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Transactions</h1>
      <p className="mt-1 text-ink-muted">Buy and sell history</p>

      <div className="surface-card mt-8">
        <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left text-sm">
          <thead className="bg-secondary/25 text-ink-muted dark:bg-primary/15">
            <tr>
              <th className="px-4 py-3 font-semibold">Asset</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Counterparty</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Fee</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink">
            {rows.map((t) => {
              const isBuy = String(t.buyer_id?._id || t.buyer_id?.id) === uid;
              const counter = isBuy ? t.seller_id : t.buyer_id;
              return (
                <tr key={t._id} className="bg-card even:bg-canvas/50">
                  <td className="px-4 py-3">
                    <Link to={`/assets/${t.asset_id?._id}`} className="font-medium text-primary-darker hover:underline">
                      {t.asset_id?.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{isBuy ? 'Buy' : 'Sell'}</td>
                  <td className="px-4 py-3 text-ink-muted">@{counter?.username}</td>
                  <td className="px-4 py-3">{formatCredits(t.price_credits)}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatCredits(t.fee_credits)}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {t.createdAt ? new Date(t.createdAt).toLocaleString() : '—'}
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
