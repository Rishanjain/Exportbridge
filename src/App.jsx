import { useState } from 'react';
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

function AppPage({ currentPage, setCurrentPage }) {
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

  // Public routes
  if (page === 'landing') return <Landing setPage={setPage} />;
  if (page === 'login') return <Login setPage={setPage} />;
  if (page === 'signup') return <Signup setPage={setPage} />;

  // App routes
  return (
    <AppLayout currentPage={appPage} setCurrentPage={setAppPage}>
      <AppPage currentPage={appPage} setCurrentPage={setAppPage} />
    </AppLayout>
  );
}
