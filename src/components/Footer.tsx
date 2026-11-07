import React from 'react';
import { Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenProfile: () => void;
  onOpenQuestions: () => void;
  onOpenAssessment: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenProfile,
  onOpenQuestions,
  onOpenAssessment,
}) => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#04060b] py-10 px-4 sm:px-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Identity */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-white font-bold text-sm tracking-tight">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>SARANYA AI</span>
          </div>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span>Personal AI Voice Twin</span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="text-slate-300">100x AI Engineer Assessment</span>
        </div>

        {/* Quiet Quick Links */}
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <button
            onClick={onOpenProfile}
            className="hover:text-purple-300 transition-colors whitespace-nowrap"
          >
            Candidate Profile
          </button>
          <button
            onClick={onOpenQuestions}
            className="hover:text-purple-300 transition-colors whitespace-nowrap"
          >
            20 Interview Q&A
          </button>
          <button
            onClick={onOpenAssessment}
            className="hover:text-purple-300 transition-colors whitespace-nowrap"
          >
            Evaluation Rubric
          </button>
        </div>

        {/* Academic Details */}
        <div className="text-center md:text-right text-slate-400">
          <p>Saranya Gadde · KIET (JNTUK) · B.Tech AI & ML 2026</p>
        </div>
      </div>
    </footer>
  );
};
