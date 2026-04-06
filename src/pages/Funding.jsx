import { ArrowRight, Percent, Users, Landmark, TrendingUp } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionHeader } from '../components/ui/index';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

const typeIcons = {
  'Government Loan': Landmark,
  'Investor': Users,
  'Private Bank': TrendingUp,
};

const badgeVariantMap = {
  emerald: 'success',
  brand: 'info',
  purple: 'purple',
};

const approvalColor = (pct) => {
  if (pct >= 80) return 'emerald';
  if (pct >= 60) return 'brand';
  return 'amber';
};

export default function Funding() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fundingOptions, setFundingOptions] = useState([]);
  const [submittingId, setSubmittingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    apiFetch('/api/funding/options')
      .then((data) => mounted && setFundingOptions(data.fundingOptions || []))
      .catch((e) => mounted && setError(e.message || 'Failed to load funding options'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const apply = async (optionId) => {
    setSubmittingId(optionId);
    setMessage('');
    setError('');
    try {
      const data = await apiFetch('/api/funding/apply', { method: 'POST', body: { optionId } });
      setMessage(`${data.message} (${data.application?.id})`);
    } catch (e) {
      setError(e.message || 'Unable to submit application');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title="Funding & Finance"
        subtitle="Loans, credit facilities and investor matches for your export business"
      />

      {(error || message) && (
        <Card hover={false} className={error ? 'border-red-500/20' : 'border-emerald-500/20'}>
          <p className={`text-sm ${error ? 'text-red-400' : 'text-emerald-400'}`}>{error || message}</p>
        </Card>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Available', value: '₹80L+', icon: Landmark, color: 'text-emerald-400 bg-emerald-500/10' },
          { label: 'Avg Approval Rate', value: '70%', icon: Percent, color: 'text-brand-400 bg-brand-500/10' },
          { label: 'Investor Matches', value: '3', icon: Users, color: 'text-purple-400 bg-purple-500/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-slate-400 text-xs">{label}</p>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Funding Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {loading && Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="h-4 bg-surface-500 rounded w-1/2 mb-3" />
            <div className="h-10 bg-surface-500 rounded w-2/3 mb-4" />
            <div className="h-10 bg-surface-500 rounded" />
          </div>
        ))}
        {fundingOptions.map((f) => {
          const TypeIcon = typeIcons[f.type] || Landmark;
          const approvalCol = approvalColor(f.approval);
          return (
            <Card key={f.id} className="hover:-translate-y-1 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-600 flex items-center justify-center">
                    <TypeIcon size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.type}</p>
                  </div>
                </div>
                {f.badge && (
                  <Badge variant={badgeVariantMap[f.badgeColor] || 'info'}>{f.badge}</Badge>
                )}
              </div>

              {/* Amount */}
              <div className="bg-surface-600/50 rounded-xl p-4 mb-4">
                <p className="text-xs text-slate-500 mb-1">Loan / Investment Amount</p>
                <p className="text-3xl font-black text-white">{f.amount}</p>
                <p className="text-xs text-slate-500 mt-1">≈ {f.amountUSD} USD · {f.tenure}</p>
              </div>

              {/* Rate */}
              <div className="flex items-center justify-between text-sm mb-4">
                <div>
                  <p className="text-slate-500 text-xs">Interest Rate</p>
                  <p className="text-white font-semibold">{f.rate}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs">Approval Probability</p>
                  <p className={`text-${approvalCol}-400 font-bold text-lg`}>{f.approval}%</p>
                </div>
              </div>

              <ProgressBar value={f.approval} color={approvalCol} height="h-2" />

              {/* Features */}
              <div className="mt-4 flex flex-wrap gap-1.5 flex-1">
                {f.features.map((feat) => (
                  <span key={feat} className="text-xs px-2.5 py-1 bg-surface-600 rounded-lg text-slate-400">{feat}</span>
                ))}
              </div>

              <button
                onClick={() => apply(f.id)}
                disabled={submittingId === f.id}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4 py-3"
              >
                {submittingId === f.id ? 'Submitting…' : 'Apply Now'} <ArrowRight size={14} />
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
