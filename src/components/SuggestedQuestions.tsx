import React from 'react';
import { HelpCircle, ChevronRight, BookOpen } from 'lucide-react';

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void;
  onOpenLibrary: () => void;
  disabled?: boolean;
}

const TOP_QUESTIONS = [
  { text: "Tell me about yourself.", icon: "👋" },
  { text: "What is your biggest strength?", icon: "⚡" },
  { text: "Explain your AI/ML projects.", icon: "🧠" },
  { text: "Why should 100x hire you?", icon: "🎯" },
  { text: "What are your career goals?", icon: "🚀" },
  { text: "Explain your Plant Disease Detection project.", icon: "🌿" },
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  onSelectQuestion,
  onOpenLibrary,
  disabled = false,
}) => {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
          <span>SUGGESTED INTERVIEW PROMPTS</span>
        </div>
        <button
          onClick={onOpenLibrary}
          className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Browse all 20 prepared questions</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {TOP_QUESTIONS.map((item, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelectQuestion(item.text)}
            className="group text-left p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-200 flex items-start justify-between gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-base select-none shrink-0 mt-0.5">{item.icon}</span>
              <span className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-purple-200 transition-colors">
                {item.text}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>
    </section>
  );
};
