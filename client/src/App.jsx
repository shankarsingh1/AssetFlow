import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ThemeSync from './components/ThemeSync.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import { useAuthStore } from './store/authStore.js';
import { useCreditStore } from './store/creditStore.js';
import * as userApi from './api/userApi.js';
import Home from './pages/Home.jsx';
import Marketplace from './pages/Marketplace.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import Upload from './pages/Upload.jsx';
import AssetDetail from './pages/AssetDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Transactions from './pages/Transactions.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

export default function App() {
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist?.hasHydrated?.() ?? true);
  const accessToken = useAuthStore((s) => s.accessToken);
  const setUser = useAuthStore((s) => s.setUser);
  const logoutLocal = useAuthStore((s) => s.logoutLocal);
  const fetchBalance = useCreditStore((s) => s.fetchBalance);
  const resetCredits = useCreditStore((s) => s.reset);

  useEffect(() => {
    const api = useAuthStore.persist;
    if (!api) {
      setHydrated(true);
      return undefined;
    }
    if (api.hasHydrated?.()) {
      setHydrated(true);
      return undefined;
    }
    api.onFinishHydration?.(() => setHydrated(true));
    const t = window.setTimeout(() => setHydrated(true), 1500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      resetCredits();
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { user } = await userApi.getMe();
        if (!cancelled) {
          setUser(user);
          await fetchBalance();
        }
      } catch {
        if (!cancelled) {
          logoutLocal();
          resetCredits();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken, setUser, logoutLocal, fetchBalance, resetCredits]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ThemeSync />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/assets/:id" element={<AssetDetail />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
