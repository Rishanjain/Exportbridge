import { TrendingUp, Users, DollarSign, Award, Package, Globe, Ship, Clock } from 'lucide-react';
import { StatCard, Card, Badge, ProgressBar, SectionHeader } from '../components/ui/index';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

const activityIcons = {
  buyer: Users,
  shipment: Ship,
  funding: DollarSign,
  guide: Award,
  insight: Globe,
};

const activityColors = {
  new: 'bg-brand-500',
  active: 'bg-amber-500',
  success: 'bg-emerald-500',
  complete: 'bg-purple-500',
  insight: 'bg-cyan-500',
};

const iconComponents = { TrendingUp, Users, DollarSign, Award };
const cardColors = ['brand', 'emerald', 'purple', 'amber'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statsData, setStatsData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [marketInsights, setMarketInsights] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    apiFetch('/api/dashboard')
      .then((data) => {
        if (!mounted) return;
        setStatsData(data.statsData || []);
        setRecentActivity(data.recentActivity || []);
        setMarketInsights(data.marketInsights || []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || 'Failed to load dashboard');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <SectionHeader title="Dashboard" subtitle="Loading your export workspace..." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-surface-500 rounded w-1/2 mb-4" />
              <div className="h-8 bg-surface-500 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <SectionHeader title="Dashboard" subtitle="Your export workspace" />
        <Card hover={false} className="border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((s, i) => {
          const Icon = iconComponents[s.icon];
          return (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              change={s.change}
              changeType={s.changeType}
              icon={Icon}
              color={cardColors[i]}
            />
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <SectionHeader title="Recent Activity" subtitle="Live updates from your export pipeline" />
          <Card>
            <div className="space-y-0">
              {recentActivity.map((a, i) => {
                const Icon = activityIcons[a.type] || Globe;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-4 py-4 ${i < recentActivity.length - 1 ? 'border-b border-white/5' : ''} hover:bg-surface-600/30 rounded-xl px-2 -mx-2 transition-colors`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${activityColors[a.status]}/20 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Icon size={14} className={`text-${a.status === 'new' ? 'brand' : a.status === 'success' ? 'emerald' : a.status === 'complete' ? 'purple' : a.status === 'insight' ? 'cyan' : 'amber'}-400`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 leading-snug">{a.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={11} className="text-slate-600" />
                        <span className="text-xs text-slate-600">{a.time}</span>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${activityColors[a.status]} flex-shrink-0 mt-2`} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Market Pulse */}
        <div>
          <SectionHeader title="Market Pulse" subtitle="Demand by country" />
          <Card>
            <div className="space-y-5">
              {marketInsights.map((m) => (
                <div key={m.country}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{m.flag}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{m.country}</p>
                        <p className="text-xs text-slate-500">{m.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{m.demand}</p>
                      <p className="text-xs text-emerald-400">{m.growth}</p>
                    </div>
                  </div>
                  <ProgressBar value={m.demand} color={m.demand > 80 ? 'brand' : m.demand > 60 ? 'cyan' : 'amber'} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <SectionHeader title="Quick Actions" subtitle="Jump to common tasks" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Package, label: 'Upload Product', color: 'brand', desc: 'Add new item' },
            { icon: Users, label: 'Find Buyers', color: 'emerald', desc: 'Browse directory' },
            { icon: DollarSign, label: 'Apply for Loan', color: 'amber', desc: 'View funding' },
            { icon: Globe, label: 'AI Analysis', color: 'purple', desc: 'Get insights' },
          ].map(({ icon: Icon, label, color, desc }) => (
            <div
              key={label}
              className={`glass-card p-5 cursor-pointer hover:-translate-y-1 transition-all duration-200 border hover:border-${color}-500/30 group`}
            >
              <div className={`w-10 h-10 rounded-xl bg-${color}-500/15 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={20} className={`text-${color}-400`} />
              </div>
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-slate-500 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
