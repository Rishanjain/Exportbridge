import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import { Card, Badge, SectionHeader } from '../components/ui/index';
import { demandTrends, exportPerformance } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-700 border border-white/10 rounded-xl p-3 shadow-xl text-sm">
        <p className="text-slate-400 font-medium mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-300 capitalize">{p.name}:</span>
            <span className="text-white font-semibold">
              {typeof p.value === 'number' && p.name === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const totalRevenue = exportPerformance.reduce((a, b) => a + b.revenue, 0);
  const totalOrders = exportPerformance.reduce((a, b) => a + b.orders, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Analytics & Reports"
        subtitle="Export performance and global demand trends"
        action={
          <select className="bg-surface-600 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-300 outline-none">
            <option>Last 7 Months</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue (7M)', value: `$${(totalRevenue / 1000).toFixed(0)}K`, change: '+18.2%' },
          { label: 'Total Orders', value: totalOrders, change: '+11 orders' },
          { label: 'Avg Order Value', value: `$${avgOrderValue.toLocaleString()}`, change: '+$240' },
        ].map(({ label, value, change }) => (
          <div key={label} className="glass-card p-5 hover:-translate-y-0.5 transition-all">
            <p className="text-slate-500 text-xs mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-emerald-400 text-xs mt-1">↑ {change}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-semibold text-white">Export Revenue & Orders</p>
            <p className="text-xs text-slate-500">Monthly performance trend</p>
          </div>
          <Badge variant="success">Live Data</Badge>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={exportPerformance} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1f34" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" name="revenue" />
            <Line type="monotone" dataKey="orders" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa', r: 4 }} name="orders" yAxisId={0} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Demand Trends */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-semibold text-white">Category Demand Trends</p>
            <p className="text-xs text-slate-500">Demand index by product category</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={demandTrends} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1f34" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12, paddingTop: 16 }} />
            <Bar dataKey="spices" name="Spices" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="textiles" name="Textiles" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            <Bar dataKey="handicrafts" name="Handicrafts" fill="#34d399" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pharma" name="Pharma" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
