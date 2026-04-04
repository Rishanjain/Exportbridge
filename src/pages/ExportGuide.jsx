import { useState } from 'react';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronUp, ExternalLink, FileText } from 'lucide-react';
import { Card, Badge, ProgressBar, SectionHeader } from '../components/ui/index';
import { exportGuideSteps } from '../data/mockData';

const statusConfig = {
  completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Completed', badge: 'success' },
  'in-progress': { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', label: 'In Progress', badge: 'warning' },
  pending: { icon: Circle, color: 'text-slate-600', bg: 'bg-surface-600 border-surface-400', label: 'Pending', badge: 'slate' },
};

const categoryColors = {
  Legal: 'text-brand-400 bg-brand-500/10',
  Compliance: 'text-purple-400 bg-purple-500/10',
  Paperwork: 'text-amber-400 bg-amber-500/10',
  Customs: 'text-cyan-400 bg-cyan-500/10',
  Finance: 'text-emerald-400 bg-emerald-500/10',
  Logistics: 'text-rose-400 bg-rose-500/10',
};

export default function ExportGuide() {
  const [expanded, setExpanded] = useState(null);
  const [steps, setSteps] = useState(exportGuideSteps);

  const completed = steps.filter(s => s.status === 'completed').length;
  const inProgress = steps.filter(s => s.status === 'in-progress').length;
  const progress = Math.round((completed / steps.length) * 100);

  const toggleExpand = (id) => setExpanded(expanded === id ? null : id);
  const markComplete = (id) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status: 'completed' } : s));
    if (expanded === id) setExpanded(null);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <SectionHeader
        title="Export Compliance Guide"
        subtitle="Complete these steps to become export-ready"
        action={<Badge variant="info">{completed}/{steps.length} Done</Badge>}
      />

      {/* Progress Overview */}
      <Card className="border-brand-500/20 bg-gradient-to-br from-brand-500/10 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-white text-lg">Export Readiness Progress</p>
            <p className="text-slate-400 text-sm">{completed} completed · {inProgress} in progress · {steps.length - completed - inProgress} pending</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black gradient-text">{progress}%</p>
            <p className="text-xs text-slate-500">Ready</p>
          </div>
        </div>
        <ProgressBar value={progress} color="brand" height="h-3" />
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { label: 'Completed', count: completed, color: 'text-emerald-400' },
            { label: 'In Progress', count: inProgress, color: 'text-amber-400' },
            { label: 'Pending', count: steps.length - completed - inProgress, color: 'text-slate-400' },
          ].map(({ label, count, color }) => (
            <div key={label} className="text-center py-2 bg-surface-600/50 rounded-xl">
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, i) => {
          const cfg = statusConfig[step.status];
          const Icon = cfg.icon;
          const isExpanded = expanded === step.id;
          const catColor = categoryColors[step.category];

          return (
            <div
              key={step.id}
              className={`glass-card border ${cfg.bg} overflow-hidden transition-all duration-200`}
            >
              <div
                className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/2"
                onClick={() => toggleExpand(step.id)}
              >
                {/* Step number / icon */}
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} border flex items-center justify-center flex-shrink-0`}>
                  {step.status === 'completed'
                    ? <CheckCircle2 size={20} className="text-emerald-400" />
                    : <span className="text-sm font-bold text-slate-400">0{i + 1}</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-semibold text-sm ${step.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                      {step.title}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>{step.category}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge variant={cfg.badge}>{cfg.label}</Badge>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Documents */}
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Required Documents</p>
                      <div className="space-y-2">
                        {step.docs.map((doc) => (
                          <div key={doc} className="flex items-center gap-2 text-sm text-slate-300">
                            <FileText size={14} className="text-brand-400 flex-shrink-0" />
                            {doc}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {step.status !== 'completed' && (
                        <button
                          onClick={() => markComplete(step.id)}
                          className="btn-primary text-sm py-2.5 flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={14} />
                          Mark as Complete
                        </button>
                      )}
                      <a
                        href={step.link}
                        className="btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={14} />
                        Official Portal
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
