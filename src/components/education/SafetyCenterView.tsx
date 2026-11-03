import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Flame,
  HeartPulse,
  Lock,
  Moon,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafetyLesson } from '../../types';

export const SafetyCenterView: React.FC = () => {
  const { lessons, toggleLessonChecklist, toggleLessonCompleted, playChime } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedLessonId, setExpandedLessonId] = useState<string>(lessons[0]?.id || '');

  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const categories = [
    { id: 'all', label: 'All Modules' },
    { id: 'First Aid Basics', label: 'First Aid & CPR' },
    { id: 'Disaster Preparedness', label: 'Disaster Prep' },
    { id: 'Personal Safety', label: 'Personal Safety' },
    { id: 'Fire Safety', label: 'Fire Safety' },
  ];

  const filteredLessons = lessons.filter((l) => {
    if (activeCategory === 'all') return true;
    return l.category === activeCategory;
  });

  const toggleExpand = (id: string) => {
    playChime('click');
    setExpandedLessonId((prev) => (prev === id ? '' : id));
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Safety Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Actionable survival guides, CPR steps, and preparedness checklists
        </p>
      </div>

      {/* Progress Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                Safety Readiness Progress
              </h2>
              <p className="text-[11px] text-slate-500">
                {completedCount} of {lessons.length} core safety lessons completed
              </p>
            </div>
          </div>
          <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-slate-900 dark:bg-white rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              playChime('click');
              setActiveCategory(cat.id);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'border-slate-900 dark:border-white bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lessons Accordion List */}
      <div className="space-y-4">
        {filteredLessons.map((lesson) => {
          const isExpanded = expandedLessonId === lesson.id;
          const completedChecklistCount = lesson.checklist.filter((c) => c.completed).length;

          return (
            <div
              key={lesson.id}
              className={`rounded-2xl border transition-all overflow-hidden bg-white dark:bg-slate-900 ${
                isExpanded
                  ? 'border-slate-900/40 dark:border-slate-700 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {/* Lesson Card Header */}
              <div
                onClick={() => toggleExpand(lesson.id)}
                className="p-4 cursor-pointer flex items-start justify-between gap-3 select-none"
              >
                <div className="space-y-1">
                  {/* Quiet unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {lesson.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{lesson.readTime}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {completedChecklistCount}/{lesson.checklist.length} Tasks
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {lesson.title}
                    {lesson.isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {lesson.summary}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Expand lesson"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0 mt-1"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded Lesson Content */}
              {isExpanded && (
                <div className="px-4 pb-5 space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4 animate-in fade-in">
                  {/* Lesson Image if available */}
                  {lesson.coverImage && (
                    <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800">
                      <img
                        src={lesson.coverImage}
                        alt={lesson.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* What to Do vs What to Avoid (Side-by-side contrast cards) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* What to Do */}
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        What to Do (Best Practices)
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {lesson.whatToDo.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✔</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What to Avoid */}
                    <div className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
                      <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        What to Avoid (Hazardous Mistakes)
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {lesson.whatToAvoid.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                            <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">✕</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actionable Safety Checklist */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Personal Action Checklist:
                      </h4>
                      <span className="text-[11px] font-mono text-slate-500">
                        {completedChecklistCount}/{lesson.checklist.length} Complete
                      </span>
                    </div>

                    <div className="space-y-2">
                      {lesson.checklist.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-start gap-2.5 cursor-pointer text-xs select-none"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleLessonChecklist(lesson.id, item.id)}
                            className="mt-0.5 w-4 h-4 rounded text-slate-900 dark:text-white focus:ring-0 focus:ring-offset-0"
                          />
                          <span
                            className={
                              item.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-800 dark:text-slate-200'
                            }
                          >
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Mark Entire Lesson Complete Button */}
                  <div className="flex items-center justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => toggleLessonCompleted(lesson.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        lesson.isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{lesson.isCompleted ? 'Completed' : 'Mark as Completed'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
