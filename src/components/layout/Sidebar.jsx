import { 
  LayoutDashboard, Globe, Users, BookOpen, Banknote, 
  Ship, BarChart3, Package, ChevronLeft, ChevronRight,
  Zap, LogOut, Settings
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'market', label: 'Market Insights', icon: Globe },
  { id: 'buyers', label: 'Buyers', icon: Users },
  { id: 'guide', label: 'Export Guide', icon: BookOpen },
  { id: 'funding', label: 'Funding', icon: Banknote },
  { id: 'shipments', label: 'Shipments', icon: Ship },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'upload', label: 'Upload Product', icon: Package },
];

export default function Sidebar({ currentPage, setCurrentPage, onLogout, collapsed, setCollapsed }) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[70px]' : 'w-[240px]'
      } bg-surface-800 border-r border-white/5`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/30">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-lg tracking-tight">ExportBridge</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentPage(id)}
            className={`sidebar-link w-full ${currentPage === id ? 'active' : ''}`}
            title={collapsed ? label : ''}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
            {!collapsed && currentPage === id && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/5 px-3 py-4 space-y-1">
        <button className="sidebar-link w-full" title={collapsed ? 'Settings' : ''}>
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          onClick={onLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface-600 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
