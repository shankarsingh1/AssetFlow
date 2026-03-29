import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import CreditBadge from './CreditBadge.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition duration-250 ${
    isActive ? 'text-primary-darker' : 'text-ink-muted hover:text-ink'
  }`;

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="nav-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight text-ink">
          Asset<span className="text-primary-darker">Flow</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/marketplace" className={linkClass}>
            Marketplace
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/upload" className={linkClass}>
                Upload
              </NavLink>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/transactions" className={linkClass}>
                Transactions
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && <CreditBadge className="hidden sm:inline-flex" />}
          {isAuthenticated ? (
            <div className="relative flex items-center gap-2">
              <Link
                to={`/profile/${user?.username}`}
                className="hidden text-sm text-ink-muted hover:text-ink sm:inline"
              >
                @{user?.username}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm text-ink-muted shadow-sm transition duration-250 hover:border-secondary hover:text-ink"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm text-ink-muted transition hover:text-ink"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-soft transition duration-250 hover:bg-primary-dark"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
