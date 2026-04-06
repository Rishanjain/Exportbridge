import { Globe, TrendingUp, ArrowRight, BarChart2, Filter } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionHeader } from '../components/ui/index';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

const demandVariant = { High: 'success', Medium: 'warning', Low: 'danger' };

export default function MarketInsights() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marketInsights, setMarketInsights] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [alert, setAlert] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [demandFilter, setDemandFilter] = useState('All'); // All | High | Medium | Low
  const [savingAlert, setSavingAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    apiFetch('/api/market/insights')
      .then((data) => {
        if (!mounted) return;
        setMarketInsights(data.marketInsights || []);
        setAiRecommendations(data.aiRecommendations || []);
        setAlert(data.alert || null);
      })
      .catch((e) => mounted && setError(e.message || 'Failed to load market insights'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const demandLevelFromHeat = (demand) => {
    if (demand > 80) return 'High';
    if (demand > 60) return 'Medium';
    return 'Low';
  };

  const filteredHeat = marketInsights.filter((m) => {
    const level = demandLevelFromHeat(m.demand);
    return demandFilter === 'All' || level === demandFilter;
  });

  const filteredRecommendations = aiRecommendations.filter((rec) => {
    return demandFilter === 'All' || rec.demandLevel === demandFilter;
  });

  const saveAlert = async () => {
    setSavingAlert(true);
    setAlertMessage('');
    setError('');

    try {
      await apiFetch('/api/market/alerts', {
        method: 'POST',
        body: {
          title: alert?.title || 'Market Trend Alert',
          badge: alert?.badge || 'New',
          summary: alert?.summary || 'Alert saved successfully',
        },
      });
      setAlertMessage('Alert saved. You will see it on your account (server-side).');
    } catch (e) {
      setError(e.message || 'Unable to save alert');
    } finally {
      setSavingAlert(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <SectionHeader title="Market Insights" subtitle="Loading global demand intelligence..." />
        <div className="grid md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-surface-500 rounded w-1/2 mb-3" />
              <div className="h-8 bg-surface-500 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <SectionHeader title="Market Insights" subtitle="AI-powered global demand intelligence updated daily" />
        <Card hover={false} className="border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="Market Insights"
        subtitle="AI-powered global demand intelligence updated daily"
        action={
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="btn-secondary text-sm py-2 flex items-center gap-2"
            type="button"
          >
            <Filter size={14} /> Filter
          </button>
        }
      />

      {filterOpen && (
        <Card className="p-4" hover={false}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-white mb-1">Filter by demand</p>
              <p className="text-xs text-slate-500">Applies to both heat cards and recommendations.</p>
            </div>
            <div className="flex items-center gap-2">
              {['All', 'High', 'Medium', 'Low'].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setDemandFilter(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    demandFilter === v ? 'bg-brand-600 text-white' : 'bg-surface-600 text-slate-400 hover:text-white'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button className="btn-secondary text-sm py-2" type="button" onClick={() => setFilterOpen(false)}>
              Done
            </button>
          </div>
        </Card>
      )}

      {/* Global Heat Summary */}
      <div className="grid md:grid-cols-5 gap-4">
        {filteredHeat.map((m) => (
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
          {filteredRecommendations.length === 0 ? (
            <Card className="p-6" hover={false}>
              <p className="text-slate-400 text-sm">No recommendations match your filter.</p>
            </Card>
          ) : (
            filteredRecommendations.map((rec) => (
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
            ))
          )}
        </div>
      </div>

      {/* Trend Summary */}
      <Card className="border-brand-500/10 bg-gradient-to-r from-brand-500/5 to-purple-500/5">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={20} className="text-brand-400" />
          <p className="font-semibold text-white">{alert?.title || 'Market Trend Alert'}</p>
          <Badge variant="success">{alert?.badge || 'New'}</Badge>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">
          {alert?.summary || 'Trend summary unavailable.'}
        </p>
        {alertMessage && (
          <p className="text-emerald-400 text-sm mt-2">{alertMessage}</p>
        )}
        <div className="flex gap-3 mt-4">
          <button className="btn-primary text-sm py-2 flex items-center gap-2">View Full Report <ArrowRight size={12} /></button>
          <button
            className="btn-secondary text-sm py-2"
            onClick={saveAlert}
            disabled={savingAlert}
            type="button"
          >
            {savingAlert ? 'Saving…' : 'Set Alert'}
          </button>
        </div>
      </Card>
    </div>
  );
}
