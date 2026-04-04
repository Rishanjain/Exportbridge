import { useState } from 'react';
import { CheckCircle2, Shield, X, ExternalLink } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionHeader } from '../components/ui/index';
import { buyers } from '../data/mockData';

const demandVariant = { High: 'success', Medium: 'warning', Low: 'danger' };

export default function Buyers() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [connected, setConnected] = useState([]);

  const industries = ['All', ...Array.from(new Set(buyers.map(b => b.industry)))];
  const filtered = buyers.filter(b => {
    const matchIndustry = filter === 'All' || b.industry === filter;
    const matchSearch = search === '' || b.company.toLowerCase().includes(search.toLowerCase()) || b.country.toLowerCase().includes(search.toLowerCase());
    return matchIndustry && matchSearch;
  });

  const toggle = (id) => setConnected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Buyer Directory"
        subtitle={`${buyers.length} verified international buyers`}
        action={
          <div className="flex items-center gap-2">
            <Badge variant="success">
              <Shield size={10} />
              {buyers.filter(b => b.verified).length} Verified
            </Badge>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search buyers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field w-64 py-2 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {industries.map(ind => (
            <button
              key={ind}
              onClick={() => setFilter(ind)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === ind
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-600 text-slate-400 hover:text-white'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Buyer Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((buyer) => {
          const isConnected = connected.includes(buyer.id);
          return (
            <Card key={buyer.id} className="group hover:-translate-y-1">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-surface-500 to-surface-600 flex items-center justify-center text-2xl border border-white/5">
                    {buyer.flag}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-white text-sm leading-tight">{buyer.company}</p>
                      {buyer.verified && (
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{buyer.country}</p>
                  </div>
                </div>
                <Badge variant={demandVariant[buyer.demand]}>{buyer.demand}</Badge>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Industry</span>
                  <span className="text-slate-300">{buyer.industry}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Interested In</span>
                  <span className="text-slate-300 text-right max-w-[150px] truncate">{buyer.interest}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Revenue Range</span>
                  <span className="text-slate-300">{buyer.revenue}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">On Platform Since</span>
                  <span className="text-slate-300">{buyer.since}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {buyer.verified && <Badge variant="verified"><Shield size={10} />Verified</Badge>}
                <Badge variant="info">{buyer.industry.split(' ')[0]}</Badge>
                {buyer.demand === 'High' && <Badge variant="success">High Demand</Badge>}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(buyer.id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'btn-primary'
                  }`}
                >
                  {isConnected ? '✓ Connected' : 'Connect'}
                </button>
                <button className="w-10 h-10 rounded-xl bg-surface-600 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500/30 transition-all">
                  <ExternalLink size={14} />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium text-slate-400 mb-2">No buyers found</p>
          <p className="text-sm">Try adjusting your search or filter.</p>
        </div>
      )}
    </div>
  );
}
