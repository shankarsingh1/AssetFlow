import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as authApi from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { useCreditStore } from '../store/creditStore.js';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const fetchBalance = useCreditStore((s) => s.fetchBalance);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authApi.register({ username, email, password });
      login({ user: data.user, accessToken: data.accessToken });
      await fetchBalance();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 md:px-6">
      <div className="surface-card p-8 md:p-10">
        <h1 className="font-display text-3xl font-semibold text-ink">Join AssetFlow</h1>
        <p className="mt-2 text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-darker hover:underline">
            Sign in
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-muted">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              className="input-field mt-1"
            />
          </div>
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
            <label className="text-sm font-medium text-ink-muted">Password (min 8)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="input-field mt-1"
            />
          </div>
          {error && <p className="text-sm text-accent">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-2 w-full py-3 disabled:opacity-50">
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}
