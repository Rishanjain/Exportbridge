// Reusable UI primitives

export function Card({ children, className = '', hover = true }) {
  return (
    <div className={`glass-card p-6 ${hover ? 'hover:border-brand-500/15 transition-all duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    verified: 'badge-verified',
    purple: 'badge bg-purple-500/15 text-purple-400 border border-purple-500/20',
    amber: 'badge bg-amber-500/15 text-amber-400 border border-amber-500/20',
    slate: 'badge bg-slate-500/15 text-slate-400 border border-slate-500/20',
  };
  return (
    <span className={`${variants[variant] || variants.info} ${className}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, max = 100, color = 'brand', height = 'h-2', showLabel = false }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    brand: 'from-brand-500 to-purple-500',
    emerald: 'from-emerald-500 to-teal-400',
    amber: 'from-amber-500 to-yellow-400',
    red: 'from-red-500 to-rose-400',
    cyan: 'from-cyan-500 to-blue-400',
  };
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-surface-500 rounded-full overflow-hidden`}>
        <div
          className={`${height} bg-gradient-to-r ${colors[color] || colors.brand} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-4 bg-surface-500 rounded w-2/3 mb-4" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 bg-surface-500 rounded mb-2 ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function StatCard({ label, value, change, changeType, icon: Icon, color = 'brand' }) {
  const colorMap = {
    brand: 'from-brand-500/20 to-brand-600/10 border-brand-500/20',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20',
  };
  const iconBg = {
    brand: 'bg-brand-500/20 text-brand-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    purple: 'bg-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/20 text-amber-400',
  };
  return (
    <div className={`stat-card border bg-gradient-to-br ${colorMap[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg[color]} flex items-center justify-center`}>
          {Icon && <Icon size={20} />}
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
            changeType === 'positive' ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-600 flex items-center justify-center mb-4">
          <Icon size={28} className="text-slate-500" />
        </div>
      )}
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs">{description}</p>
    </div>
  );
}
