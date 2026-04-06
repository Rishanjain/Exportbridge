import { Package, Clock, DollarSign, MapPin, Star, ExternalLink } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionHeader } from '../components/ui/index';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';

const statusVariant = { 'In Transit': 'info', 'Customs Clearance': 'warning', 'Delivered': 'success', 'Preparing': 'slate' };

export default function Shipments() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shipments, setShipments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [quoteMsg, setQuoteMsg] = useState('');
  const [quoting, setQuoting] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    Promise.all([apiFetch('/api/shipments'), apiFetch('/api/shipments/providers')])
      .then(([s, p]) => {
        if (!mounted) return;
        setShipments(s.shipments || []);
        setProviders(p.providers || []);
      })
      .catch((e) => mounted && setError(e.message || 'Failed to load shipments'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const active = shipments.filter((s) => s.status !== 'Delivered').length;
    const delivered = shipments.filter((s) => s.status === 'Delivered').length;
    const costs = shipments
      .map((s) => Number(String(s.cost || '').replace(/[^0-9.]/g, '')))
      .filter((n) => Number.isFinite(n));
    const avg = costs.length ? (costs.reduce((a, b) => a + b, 0) / costs.length) : 0;
    const onTime = 94;
    return { active, delivered, avg: avg ? `$${Math.round(avg).toLocaleString()}` : '$0', onTime };
  }, [shipments]);

  const getQuote = async (providerName) => {
    setQuoting(providerName);
    setQuoteMsg('');
    setError('');
    try {
      const data = await apiFetch('/api/shipments/quote', { method: 'POST', body: { providerName } });
      setQuoteMsg(`${data.message}: ${providerName} — $${data.quote?.amount} · ~${data.quote?.etaDays} days`);
    } catch (e) {
      setError(e.message || 'Unable to get quote');
    } finally {
      setQuoting(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="Shipments & Logistics"
        subtitle="Real-time tracking of your global deliveries"
      />

      {(error || quoteMsg) && (
        <Card hover={false} className={error ? 'border-red-500/20' : 'border-emerald-500/20'}>
          <p className={`text-sm ${error ? 'text-red-400' : 'text-emerald-400'}`}>{error || quoteMsg}</p>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Shipments', value: String(summary.active), color: 'brand' },
          { label: 'Delivered (MTD)', value: String(summary.delivered), color: 'emerald' },
          { label: 'Avg. Cost/Shipment', value: summary.avg, color: 'amber' },
          { label: 'On-Time Rate', value: `${summary.onTime}%`, color: 'purple' },
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
          {loading && (
            <div className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-surface-500 rounded w-1/3 mb-4" />
              <div className="h-10 bg-surface-500 rounded" />
            </div>
          )}
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
                <button
                  onClick={() => getQuote(p.name)}
                  disabled={quoting === p.name}
                  className="w-full btn-secondary mt-3 py-2 text-xs"
                >
                  {quoting === p.name ? 'Quoting…' : 'Get Quote'}
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
