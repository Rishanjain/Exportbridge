import { useState } from 'react';
import { Package, ChevronDown, Loader, Sparkles } from 'lucide-react';
import { Card, SectionHeader, Badge, ProgressBar } from '../components/ui/index';
import { useEffect } from 'react';
import { apiFetch } from '../lib/api';

const demandBadge = (level) => {
  if (level === 'High') return 'success';
  if (level === 'Medium') return 'warning';
  return 'danger';
};

export default function ProductUpload({ setPage }) {
  const [form, setForm] = useState({ name: '', category: '', price: '', desc: '' });
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    apiFetch('/api/meta/categories')
      .then((data) => mounted && setCategories(data.categories || []))
      .catch(() => mounted && setCategories([]));
    return () => {
      mounted = false;
    };
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.category) {
      setError('Please fill in the product name and category.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to analyze product');
        setLoading(false);
        return;
      }

      setAnalysis(data.analysis);
      setAnalyzed(true);
    } catch (err) {
      setError('Network error: please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl">
      <SectionHeader
        title="Add Product & Analyze Market"
        subtitle="Our AI will find the best global markets for your product"
      />

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <Package size={20} className="text-brand-400" />
              </div>
              <div>
                <p className="font-semibold text-white">Product Details</p>
                <p className="text-xs text-slate-500">Fill in to get AI insights</p>
              </div>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Kashmiri Saffron"
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Category *</label>
                <div className="relative">
                  <select
                    className="input-field appearance-none pr-8"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="input-field pl-8"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your product quality, certifications, capacity..."
                  className="input-field resize-none"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
              </div>

              {error && <p className="text-danger-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Analyzing Markets...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze Market
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-white">AI Market Recommendations</p>
            {analyzed && <Badge variant="success">Analysis Complete</Badge>}
          </div>

          {!analyzed && !loading && (
            <Card className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-surface-600 flex items-center justify-center mb-4">
                <Sparkles size={28} className="text-slate-500" />
              </div>
              <p className="text-white font-medium mb-2">Ready to Analyze</p>
              <p className="text-slate-500 text-sm max-w-xs">Fill in your product details and click "Analyze Market" to get AI-powered export recommendations.</p>
            </Card>
          )}

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-surface-500 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-surface-500 rounded w-1/2" />
                      <div className="h-3 bg-surface-500 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-3 bg-surface-500 rounded w-full mb-2" />
                  <div className="h-3 bg-surface-500 rounded w-3/4" />
                </div>
              ))}
            </div>
          )}

          {analyzed && analysis && (
            <div className="space-y-4">
              <Card className="border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-purple-500/5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-white">Export Readiness Score</p>
                  <span className="text-2xl font-black gradient-text">{analysis.score}/100</span>
                </div>
                <ProgressBar value={analysis.score} color="brand" height="h-3" />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Product Quality</p>
                    <p className="text-lg font-bold text-white">{analysis.breakdown.quality}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Market Fit</p>
                    <p className="text-lg font-bold text-white">{analysis.breakdown.marketFit}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Compliance Ready</p>
                    <p className="text-lg font-bold text-white">{analysis.breakdown.complianceReady}</p>
                  </div>
                </div>
              </Card>

              <Card>
                <p className="text-sm text-slate-400 mb-4">{analysis.insights}</p>
                {analysis.recommendations.map((rec) => (
                  <Card key={rec.id} className="mb-4 border-slate-700/60">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">🌍</div>
                        <div>
                          <p className="font-semibold text-white">{rec.country}</p>
                          <p className="text-xs text-slate-500">{rec.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={demandBadge(rec.demandLevel)}>{rec.demandLevel} Demand</Badge>
                        <p className="text-xs text-emerald-400 mt-1">{rec.marketSize} market</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-3">{rec.reason}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Score: <span className="text-white font-medium">{rec.score}/100</span></span>
                      </div>
                      <button className="btn-primary text-xs px-4 py-2">Explore</button>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={rec.score} color="brand" height="h-1.5" />
                    </div>
                  </Card>
                ))}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
