import { Package, Clock, DollarSign, MapPin, Star, ExternalLink } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionHeader } from '../components/ui/index';
import { shipments, providers } from '../data/mockData';

const statusVariant = { 'In Transit': 'info', 'Customs Clearance': 'warning', 'Delivered': 'success', 'Preparing': 'slate' };

export default function Shipments() {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="Shipments & Logistics"
        subtitle="Real-time tracking of your global deliveries"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Shipments', value: '2', color: 'brand' },
          { label: 'Delivered (MTD)', value: '1', color: 'emerald' },
          { label: 'Avg. Cost/Shipment', value: '$2,007', color: 'amber' },
          { label: 'On-Time Rate', value: '94%', color: 'purple' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`glass-card p-5 border hover:border-${color}-500/20 transition-all hover:-translate-y-0.5`}>
            <p className="text-slate-500 text-xs mb-1">{label}</p>
            <p className={`text-2xl font-bold text-${color}-400`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Shipment List */}
        <div className="lg:col-span-2 space-y-4">
          <p className="font-semibold text-white">Active & Recent Shipments</p>
          {shipments.map((s) => (
            <Card key={s.id} className="hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center text-xl">
                    {s.flag}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-sm">{s.id}</p>
                      <Badge variant={statusVariant[s.status] || 'info'}>{s.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} />
                      {s.destination}
                    </p>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <ExternalLink size={14} />
                </button>
              </div>

              <p className="text-sm text-slate-400 mb-3">
                <Package size={12} className="inline mr-1 text-slate-600" />
                {s.product}
              </p>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Shipment Progress</span>
                  <span>{s.progress}%</span>
                </div>
                <ProgressBar
                  value={s.progress}
                  color={s.status === 'Delivered' ? 'emerald' : s.status === 'Customs Clearance' ? 'amber' : 'brand'}
                  height="h-2"
                />
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-surface-600/50 rounded-lg p-2 text-center">
                  <p className="text-slate-500 mb-0.5">Provider</p>
                  <p className="text-white font-medium">{s.provider.split(' ')[0]}</p>
                </div>
                <div className="bg-surface-600/50 rounded-lg p-2 text-center">
                  <p className="text-slate-500 mb-0.5">Cost</p>
                  <p className="text-white font-medium">{s.cost}</p>
                </div>
                <div className="bg-surface-600/50 rounded-lg p-2 text-center">
                  <p className="text-slate-500 mb-0.5">ETA</p>
                  <p className="text-white font-medium">{s.time.split('–')[0]}d</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Departed: {s.departure}</span>
                <span className="font-mono text-slate-600">{s.tracking}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Providers */}
        <div>
          <p className="font-semibold text-white mb-4">Shipping Providers</p>
          <div className="space-y-3">
            {providers.map((p) => (
              <Card key={p.name} className="p-4 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center text-xl">
                    {p.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.specialty}</p>
                    <p className="text-xs text-slate-600">{p.coverage}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star size={10} className="fill-amber-400" />
                      {p.rating}
                    </div>
                  </div>
                </div>
                <button className="w-full btn-secondary mt-3 py-2 text-xs">Get Quote</button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
