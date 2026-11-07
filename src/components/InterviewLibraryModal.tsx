import React, { useState } from 'react';
import { X, Search, Sparkles, MessageSquareQuote, Check } from 'lucide-react';
import { SARANYA_PROFILE } from '../data/profile';

interface InterviewLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskQuestion: (question: string) => void;
}

export const InterviewLibraryModal: React.FC<InterviewLibraryModalProps> = ({
  isOpen,
  onClose,
  onAskQuestion,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Story & Strengths', 'Technical & Projects', 'Mindset & Growth', '100x & Career'];

  const filtered = SARANYA_PROFILE.interviewAnswers.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c101c] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/60">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100x Assessment Question Matrix</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              20 Curated Interview Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Test Saranya&apos;s digital twin on any of the official assessment questions with a single click.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/30 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search among 20 interview questions or answers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-slate-400 text-sm">
              No matching questions found for &ldquo;{search}&rdquo;.
            </p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-purple-400/80 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/40 shrink-0 mt-0.5">
                      #{item.id < 10 ? `0${item.id}` : item.id}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white leading-snug">
                        {item.question}
                      </h4>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Category: {item.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onAskQuestion(item.question);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-sm shrink-0 transition-transform active:scale-95 flex items-center gap-1"
                  >
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    <span>Ask Twin</span>
                  </button>
                </div>

                {/* Collapsible Answer Preview */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    {expandedId === item.id ? 'Hide prepared answer' : 'Preview prepared first-person answer ↓'}
                  </button>

                  {expandedId === item.id && (
                    <div className="mt-2 p-3 rounded-xl bg-slate-950/70 border border-purple-500/20 text-xs text-slate-300 leading-relaxed italic">
                      &ldquo;{item.answer}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>Total: 20 Curated Assessment Questions</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
