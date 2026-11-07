import React, { useState } from 'react';
import { SPRINT_TASKS } from '../data/mockData';
import { SprintTask } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Layers, 
  ShieldAlert, 
  Filter, 
  Sparkles,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const SprintTracker: React.FC = () => {
  const [tasks, setTasks] = useState<SprintTask[]>(SPRINT_TASKS);
  const [activePhaseFilter, setActivePhaseFilter] = useState<number | 'all'>('all');
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('all');
  const [expandedPhase, setExpandedPhase] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  });

  const phases = [
    { id: 1, title: 'Phase 1: Environment & Auth Setup', desc: 'Docker scaffolding, Argon2id hashing, dual JWT/refresh cookie architecture.' },
    { id: 2, title: 'Phase 2: Database & Backend Core Logic', desc: 'PostgreSQL migrations, event query filters, atomic RSVP concurrency locks.' },
    { id: 3, title: 'Phase 3: Frontend UI Components & Event Views', desc: 'Responsive discovery cards, agenda calendar, search & category filters.' },
    { id: 4, title: 'Phase 4: Role-Based Authorization & Protected Actions', desc: 'RBAC route guards, Organizer Event Studio, Attendee roster management.' },
    { id: 5, title: 'Phase 5: Testing & Deployment', desc: 'Playwright E2E suite, OWASP security audit, CI/CD pipeline on Cloud Run.' }
  ];

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const togglePhaseExpand = (phaseId: number) => {
    setExpandedPhase(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Backend': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Frontend': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DevOps': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Security': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Engineering Sprint Checklist & Task Breakdown</h2>
            <p className="text-sm text-slate-600 mt-1">
              Phased roadmap with deliverables, role accountability, and verifiable Definition of Done (DoD).
            </p>
          </div>

          {/* Overall Sprint Progress */}
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-700 mb-1">
                <span>Sprint Completion</span>
                <span className="font-mono">{completedTasks}/{totalTasks} ({progressPercent}%)</span>
              </div>
              <div className="w-48 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Phase:</span>
            <button
              onClick={() => setActivePhaseFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                activePhaseFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              All Phases
            </button>
            {phases.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePhaseFilter(p.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activePhaseFilter === p.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Phase {p.id}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Discipline:</span>
            {['all', 'Backend', 'Frontend', 'DevOps', 'Security'].map(r => (
              <button
                key={r}
                onClick={() => setActiveRoleFilter(r)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeRoleFilter === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'all' ? 'All Roles' : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Phased Task Lists */}
      <div className="space-y-4">
        {phases
          .filter(p => activePhaseFilter === 'all' || activePhaseFilter === p.id)
          .map(phase => {
            const phaseTasks = tasks.filter(t => t.phaseId === phase.id && (activeRoleFilter === 'all' || t.role === activeRoleFilter));
            const phaseCompleted = phaseTasks.filter(t => t.completed).length;
            const isExpanded = expandedPhase[phase.id];

            if (phaseTasks.length === 0) return null;

            return (
              <div key={phase.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                {/* Phase Accordion Header */}
                <div 
                  onClick={() => togglePhaseExpand(phase.id)}
                  className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-slate-400">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{phase.title}</h3>
                      <p className="text-xs text-slate-500">{phase.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {phaseCompleted}/{phaseTasks.length} Completed
                    </span>
                    <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500"
                        style={{ width: `${(phaseCompleted / phaseTasks.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tasks List */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100">
                    {phaseTasks.map(task => (
                      <div 
                        key={task.id} 
                        className={`p-5 transition-colors flex items-start gap-4 ${
                          task.completed ? 'bg-white' : 'bg-slate-50/30'
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className="mt-0.5 text-blue-600 hover:text-blue-700 transition-colors shrink-0"
                          title="Click to toggle status"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                          )}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-400">{task.id}</span>
                              <h4 className={`text-sm font-bold ${task.completed ? 'text-slate-900' : 'text-slate-800'}`}>
                                {task.title}
                              </h4>
                            </div>

                            <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${getRoleBadge(task.role)}`}>
                              {task.role}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {task.description}
                          </p>

                          {/* Deliverable & DoD */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                            <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                              <span className="font-bold text-slate-700 block mb-0.5">Primary Deliverable:</span>
                              <span className="text-slate-600">{task.deliverable}</span>
                            </div>

                            <div className="p-2.5 rounded bg-emerald-50/50 border border-emerald-100/60">
                              <span className="font-bold text-emerald-800 block mb-0.5">Definition of Done (DoD):</span>
                              <span className="text-emerald-700 font-mono text-[11px]">{task.dod}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
