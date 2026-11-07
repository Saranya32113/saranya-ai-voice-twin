import React from 'react';
import { Volume2, VolumeX, Sparkles, SlidersHorizontal } from 'lucide-react';
import { VoiceSettings } from '../types/assistant';

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenQuestions: () => void;
  onOpenAssessment: () => void;
  voiceSettings: VoiceSettings;
  onToggleAutoSpeak: () => void;
  onOpenSettings: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  onOpenQuestions,
  onOpenAssessment,
  voiceSettings,
  onToggleAutoSpeak,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#06080F]/85 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
            SARANYA AI
          </span>
          <span className="text-xs font-medium text-purple-400/80 hidden sm:inline">
            Digital Twin
          </span>
        </a>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0 text-white"
          >
            Voice Twin
          </button>
          <button
            onClick={onOpenProfile}
            className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0 text-slate-300"
          >
            Projects & Skills
          </button>
          <button
            onClick={onOpenQuestions}
            className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0 text-slate-300"
          >
            20 Interview Q&A
          </button>
          <button
            onClick={onOpenAssessment}
            className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0 text-slate-300"
          >
            100x Rubric
          </button>
        </nav>

        {/* Zone 3: 1 primary action controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleAutoSpeak}
            title={voiceSettings.autoSpeak ? 'Auto-voice response is ON' : 'Auto-voice response is OFF'}
            className={`p-2 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 ${
              voiceSettings.autoSpeak
                ? 'border-purple-500/40 bg-purple-950/40 text-purple-300 hover:bg-purple-900/40'
                : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {voiceSettings.autoSpeak ? (
              <Volume2 className="w-4 h-4 text-purple-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span className="hidden sm:inline text-xs whitespace-nowrap">
              {voiceSettings.autoSpeak ? 'Audio ON' : 'Muted'}
            </span>
          </button>

          <button
            onClick={onOpenSettings}
            title="Voice Speed & Engine Settings"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenProfile}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-purple-600/20 transition-all whitespace-nowrap shrink-0"
          >
            View Profile
          </button>
        </div>
      </div>
    </header>
  );
};
