import { useState } from 'react';
import { 
  Globe, ArrowRight, Zap, Brain, FileCheck, Banknote, Ship, BarChart3,
  Star, CheckCircle, ChevronRight, Menu, X
} from 'lucide-react';
import { testimonials, features } from '../data/mockData';

const steps = [
  { num: '01', title: 'List Your Products', desc: 'Upload products with details. Our AI instantly analyzes global demand.' },
  { num: '02', title: 'Get Matched', desc: 'Connect with verified international buyers and get AI-recommended export markets.' },
  { num: '03', title: 'Export With Confidence', desc: 'Handle compliance, funding, and logistics—all on one platform.' },
];

const iconMap = { Globe, Brain, FileCheck, Banknote, Ship, BarChart3 };
const colorMap = {
  brand: 'from-brand-500/20 to-brand-600/10 text-brand-400 border-brand-500/20',
  purple: 'from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/20',
  emerald: 'from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/20',
  amber: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/20',
  cyan: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/20',
  rose: 'from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/20',
};

export default function Landing({ setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-900 text-white overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-white">ExportBridge</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            {['Features', 'How It Works', 'Testimonials'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setPage('login')} className="btn-ghost text-sm">Login</button>
            <button onClick={() => setPage('signup')} className="btn-primary text-sm py-2">Get Started</button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-400">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-surface-800 border-t border-white/5 px-6 py-4 space-y-3">
            {['Features', 'How It Works', 'Testimonials'].map(l => (
              <a key={l} href="#" className="block text-slate-400 hover:text-white py-1 text-sm">{l}</a>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPage('login')} className="btn-secondary flex-1 text-sm py-2">Login</button>
              <button onClick={() => setPage('signup')} className="btn-primary flex-1 text-sm py-2">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-16 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-8">
            <Zap size={14} />
            AI-Powered Export Intelligence Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-balance">
            From{' '}
            <span className="gradient-text">Local Sellers</span>
            {' '}to{' '}
            <span className="gradient-text">Global Markets</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            ExportBridge connects small manufacturers and traders with verified international buyers,
            export guidance, and access to funding — all on one intelligent platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setPage('signup')}
              className="btn-primary flex items-center gap-2 text-base px-8 py-4"
            >
              Start Export Journey <ArrowRight size={18} />
            </button>
            <button onClick={() => setPage('login')} className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
              View Demo Dashboard
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto">
            {[
              { val: '10K+', label: 'Verified Buyers' },
              { val: '80+', label: 'Countries' },
              { val: '$240M', label: 'Exports Facilitated' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold gradient-text">{val}</p>
                <p className="text-slate-500 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Everything You Need</p>
            <h2 className="text-4xl font-bold text-white mb-4">Built for Export Success</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every tool a small exporter needs, beautifully integrated into one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = iconMap[f.icon];
              const cls = colorMap[f.color];
              return (
                <div
                  key={f.title}
                  className={`glass-card p-6 border bg-gradient-to-br ${cls} hover:-translate-y-1 transition-all duration-200 group`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cls} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                    {Icon && <Icon size={22} />}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-transparent to-surface-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl font-bold text-white">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="glass-card p-8 text-center hover:-translate-y-1 transition-all duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center mx-auto mb-5">
                    <span className="text-white font-black text-lg">{step.num}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <ChevronRight size={24} className="text-brand-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand-400 text-sm font-semibold uppercase tracking-widest mb-3">Success Stories</p>
            <h2 className="text-4xl font-bold text-white">Trusted by Exporters</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card p-6 hover:-translate-y-1 transition-all duration-200">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 border-brand-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-transparent" />
            <div className="relative">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Go Global?</h2>
              <p className="text-slate-400 mb-8">Join thousands of Indian exporters already growing with ExportBridge.</p>
              <button
                onClick={() => setPage('signup')}
                className="btn-primary text-base px-10 py-4 flex items-center gap-2 mx-auto"
              >
                Start Export Journey <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-slate-600 text-sm">
        © 2026 ExportBridge Technologies Pvt. Ltd. — Empowering Indian Exporters
      </footer>
    </div>
  );
}
