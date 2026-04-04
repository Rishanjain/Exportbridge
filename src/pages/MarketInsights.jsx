import { Globe, TrendingUp, ArrowRight, BarChart2, Filter } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionHeader } from '../components/ui/index';
import { marketInsights, aiRecommendations } from '../data/mockData';

const demandVariant = { High: 'success', Medium: 'warning', Low: 'danger' };

export default function MarketInsights() {
  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="Market Insights"
        subtitle="AI-powered global demand intelligence updated daily"
        action={
          <button className="btn-secondary text-sm py-2 flex items-center gap-2">
            <Filter size={14} /> Filter
          </button>
        }
      />

      {/* Global Heat Summary */}
      <div className="grid md:grid-cols-5 gap-4">
        {marketInsights.map((m) => (
          <Card key={m.country} className="p-4 text-center hover:-translate-y-1">
            <div className="text-3xl mb-2">{m.flag}</div>
            <p className="text-white font-semibold text-sm">{m.country}</p>
            <p className="text-slate-500 text-xs mb-2">{m.category}</p>
            <p className={`text-xl font-black ${m.demand > 80 ? 'text-emerald-400' : m.demand > 60 ? 'text-brand-400' : 'text-amber-400'}`}>
              {m.demand}
            </p>
            <p className="text-xs text-emerald-400 mb-2">{m.growth}</p>
            <ProgressBar value={m.demand} color={m.demand > 80 ? 'emerald' : m.demand > 60 ? 'brand' : 'amber'} height="h-1" />
          </Card>
        ))}
      </div>

      {/* Detailed Recommendations */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <Globe size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Top Market Opportunities</p>
            <p className="text-xs text-slate-500">Based on current global demand and trade data</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {aiRecommendations.map((rec) => (
            <Card key={rec.id} className="hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{rec.flag}</span>
                  <div>
                    <p className="font-bold text-white text-lg">{rec.country}</p>
                    <p className="text-sm text-slate-500">{rec.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={demandVariant[rec.demandLevel]}>{rec.demandLevel} Demand</Badge>
                  <p className="text-emerald-400 text-sm font-semibold mt-1">{rec.growth}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-surface-600/50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">Market Size</p>
                  <p className="text-white font-bold">{rec.marketSize}</p>
                </div>
                <div className="bg-surface-600/50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">AI Score</p>
                  <p className="text-brand-400 font-bold text-lg">{rec.score}/100</p>
                </div>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-4">{rec.reason}</p>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Opportunity Score</span>
                  <span>{rec.score}%</span>
                </div>
                <ProgressBar value={rec.score} color="brand" height="h-2" />
              </div>

              <button className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-sm">
                Explore Opportunity <ArrowRight size={14} />
              </button>
            </Card>
          ))}
        </div>
      </div>

      {/* Trend Summary */}
      <Card className="border-brand-500/10 bg-gradient-to-r from-brand-500/5 to-purple-500/5">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={20} className="text-brand-400" />
          <p className="font-semibold text-white">Market Trend Alert</p>
          <Badge variant="success">New</Badge>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          <strong className="text-white">UAE Spice Market</strong> is seeing a <strong className="text-emerald-400">34% surge</strong> in demand for South Asian spice imports. 
          Post-CEPA agreement, tariff barriers have dropped significantly. This is an optimal window for exporters with certified organic products.
        </p>
        <div className="flex gap-3 mt-4">
          <button className="btn-primary text-sm py-2 flex items-center gap-2">View Full Report <ArrowRight size={12} /></button>
          <button className="btn-secondary text-sm py-2">Set Alert</button>
        </div>
      </Card>
    </div>
  );
}
