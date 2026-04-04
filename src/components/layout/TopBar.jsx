import { Bell, Search, ChevronDown } from 'lucide-react';

const pageTitles = {
  dashboard: { title: 'Dashboard', sub: 'Welcome back, Ravi 👋' },
  market: { title: 'Market Insights', sub: 'AI-powered global demand analysis' },
  buyers: { title: 'Buyer Directory', sub: 'Browse and connect with verified buyers' },
  guide: { title: 'Export Guide', sub: 'Step-by-step compliance checklist' },
  funding: { title: 'Funding & Finance', sub: 'Loans, credit and investor matches' },
  shipments: { title: 'Shipments', sub: 'Track and manage your logistics' },
  analytics: { title: 'Analytics', sub: 'Export performance and market trends' },
  upload: { title: 'Product Upload', sub: 'Add product and get AI market analysis' },
};

export default function TopBar({ currentPage }) {
  const { title, sub } = pageTitles[currentPage] || pageTitles.dashboard;

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-surface-800/50 backdrop-blur-sm sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-surface-700 border border-white/5 rounded-lg pl-8 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 w-48 focus:outline-none focus:border-brand-500/50 focus:w-56 transition-all duration-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-surface-700 border border-white/5 hover:border-brand-500/30 text-slate-400 hover:text-white transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full animate-pulse-slow" />
        </button>

        {/* Avatar */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-surface-700 border border-white/5 hover:border-brand-500/30 transition-all">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            RS
          </div>
          <span className="text-sm text-slate-300 hidden md:block">Ravi S.</span>
          <ChevronDown size={12} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}
