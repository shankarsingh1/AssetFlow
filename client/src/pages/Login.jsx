import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as authApi from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { useCreditStore } from '../store/creditStore.js';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const fetchBalance = useCreditStore((s) => s.fetchBalance);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login({ email, password });
      login({ user: data.user, accessToken: data.accessToken });
      await fetchBalance();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:px-6">
      <div className="surface-card p-8 md:p-10">
        <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-ink-muted">
          New here?{' '}
          <Link to="/register" className="font-medium text-primary-darker hover:underline">
            Create an account
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-muted">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field mt-1"
            />
          </div>
          {error && <p className="text-sm text-accent">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full py-3 disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
