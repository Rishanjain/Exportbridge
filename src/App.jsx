import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import Landing from './pages/Landing';
import { Login, Signup } from './pages/Auth';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import MarketInsights from './pages/MarketInsights';
import Buyers from './pages/Buyers';
import ExportGuide from './pages/ExportGuide';
import Funding from './pages/Funding';
import Shipments from './pages/Shipments';
import Analytics from './pages/Analytics';
import ProductUpload from './pages/ProductUpload';

const appPages = ['dashboard', 'market', 'buyers', 'guide', 'funding', 'shipments', 'analytics', 'upload'];

function AppPage({ currentPage }) {
  switch (currentPage) {
    case 'dashboard': return <Dashboard />;
    case 'market': return <MarketInsights />;
    case 'buyers': return <Buyers />;
    case 'guide': return <ExportGuide />;
    case 'funding': return <Funding />;
    case 'shipments': return <Shipments />;
    case 'analytics': return <Analytics />;
    case 'upload': return <ProductUpload />;
    default: return <Dashboard />;
  }
}

export default function App() {
  const [page, setPage] = useState('landing');
  const [appPage, setAppPage] = useState('dashboard');
  const [checkingSession, setCheckingSession] = useState(true);

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => console.log('Backend response:', data))
      .catch((err) => console.log('Error:', err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCheckingSession(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Session invalid');
        }
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('user', JSON.stringify(data.user));
        setPage('dashboard');
      })
      .catch(() => {
        clearAuth();
        setPage('landing');
      })
      .finally(() => setCheckingSession(false));
  }, []);

  const handleLogout = () => {
    clearAuth();
    setAppPage('dashboard');
    setPage('landing');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center text-slate-300">
        Loading...
      </div>
    );
  }

  // Public routes
  if (page === 'landing') return <Landing setPage={setPage} />;
  if (page === 'login') return <Login setPage={setPage} />;
  if (page === 'signup') return <Signup setPage={setPage} />;

  // App routes
  return (
    <AppLayout currentPage={appPage} setCurrentPage={setAppPage} onLogout={handleLogout}>
      <AppPage currentPage={appPage} />
    </AppLayout>
  );
}
