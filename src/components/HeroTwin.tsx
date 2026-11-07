import React from 'react';
import { Sparkles, RotateCcw, Square, AlertCircle, Volume2 } from 'lucide-react';
import { VoiceState, VoiceSettings } from '../types/assistant';
import { MicrophoneButton } from './MicrophoneButton';
import { AudioWaveform } from './AudioWaveform';

interface HeroTwinProps {
  voiceState: VoiceState;
  transcript: string;
  micError: string | null;
  onToggleListen: () => void;
  onStopSpeaking: () => void;
  onReplayLastAnswer: () => void;
  lastAssistantMessage: string | null;
  onScrollToChat: () => void;
  voiceSettings: VoiceSettings;
}

export const HeroTwin: React.FC<HeroTwinProps> = ({
  voiceState,
  transcript,
  micError,
  onToggleListen,
  onStopSpeaking,
  onReplayLastAnswer,
  lastAssistantMessage,
  onScrollToChat,
}) => {
  const getStatusLabel = () => {
    switch (voiceState) {
      case 'listening':
        return { label: 'Listening to your voice...', color: 'text-rose-400 bg-rose-950/40 border-rose-800/60' };
      case 'thinking':
        return { label: 'Saranya is thinking...', color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/60' };
      case 'speaking':
        return { label: 'Speaking answer...', color: 'text-purple-400 bg-purple-950/40 border-purple-800/60' };
      default:
        return { label: 'Ready to converse', color: 'text-slate-300 bg-slate-900/60 border-slate-800' };
    }
  };

  const status = getStatusLabel();

  return (
    <section className="relative w-full pt-8 pb-12 px-4 sm:px-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-900/20 via-indigo-900/25 to-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Subtle sub-kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-purple-500/20 text-xs font-medium text-purple-300 mb-4 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>100x AI Engineer Candidate Assessment</span>
        </div>

        {/* Main Titles */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-2">
          SARANYA AI
        </h1>
        <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-purple-300 via-indigo-200 to-sky-300 bg-clip-text text-transparent mb-4">
          Meet My Digital Twin
        </p>
        <p className="max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
          Hi! I&apos;m Saranya&apos;s AI voice twin. Ask me anything about my journey, technical skills, projects, experiences and career goals.
        </p>

        {/* Central Twin Visual & Interactive Stage */}
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative">
          {/* Avatar with speaking wave glow */}
          <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-6">
            {/* Animated aura ring */}
            <div
              className={`absolute -inset-2 rounded-full transition-all duration-500 ${
                voiceState === 'listening'
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 animate-pulse blur-md'
                  : voiceState === 'speaking'
                  ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 animate-spin blur-md opacity-80'
                  : 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-sm'
              }`}
            />

            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-slate-700/80 bg-slate-800">
              <img
                src="/src/assets/images/saranya_portrait_1794014759640.jpg"
                alt="Saranya Gadde AI Twin"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback') as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                className="avatar-fallback hidden w-full h-full bg-gradient-to-br from-indigo-900 to-purple-950 items-center justify-center text-2xl font-bold text-purple-200"
              >
                SG
              </div>
            </div>

            {/* Audio wave pulse badge */}
            <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-slate-900 border border-slate-700 text-purple-400 shadow-md">
              <Volume2 className={`w-4 h-4 ${voiceState === 'speaking' ? 'animate-bounce text-purple-300' : 'text-slate-400'}`} />
            </div>
          </div>

          {/* Current State Indicator */}
          <div className="flex items-center justify-center mb-4">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${status.color}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  voiceState === 'listening'
                    ? 'bg-rose-500 animate-ping'
                    : voiceState === 'speaking'
                    ? 'bg-purple-400 animate-pulse'
                    : voiceState === 'thinking'
                    ? 'bg-indigo-400 animate-pulse'
                    : 'bg-slate-400'
                }`}
              />
              {status.label}
            </span>
          </div>

          {/* Real-time live transcript display */}
          <div className="min-h-[44px] flex items-center justify-center px-4 mb-5">
            {voiceState === 'listening' ? (
              <p className="text-sm font-medium text-rose-300 italic animate-pulse">
                {transcript || 'Listening... Speak into your microphone'}
              </p>
            ) : voiceState === 'thinking' ? (
              <p className="text-sm text-indigo-300 font-medium">
                Synthesizing response through Gemini AI...
              </p>
            ) : voiceState === 'speaking' ? (
              <p className="text-sm text-purple-200 line-clamp-2">
                &ldquo;{lastAssistantMessage || 'Speaking response...'}&rdquo;
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Click the microphone to ask Saranya a question, or type below
              </p>
            )}
          </div>

          {/* Audio Waveform Canvas */}
          <AudioWaveform state={voiceState} className="mb-6" />

          {/* Central Microphone Button and Action Toolbar */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-2">
            {/* Replay Button */}
            <button
              onClick={onReplayLastAnswer}
              disabled={!lastAssistantMessage || voiceState === 'listening' || voiceState === 'thinking'}
              title="Replay last spoken answer"
              className={`p-3 rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition-all ${
                !lastAssistantMessage || voiceState === 'listening' || voiceState === 'thinking'
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:scale-105 active:scale-95'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Central Pulse Mic */}
            <MicrophoneButton
              state={voiceState}
              onToggleListen={onToggleListen}
              onStopSpeaking={onStopSpeaking}
            />

            {/* Stop Speaking / Action Button */}
            <button
              onClick={onStopSpeaking}
              disabled={voiceState !== 'speaking'}
              title="Stop speaking"
              className={`p-3 rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-rose-400 hover:border-rose-800/60 transition-all ${
                voiceState !== 'speaking'
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:scale-105 active:scale-95 bg-rose-950/20 border-rose-800/40 text-rose-300'
              }`}
            >
              <Square className="w-5 h-5" />
            </button>
          </div>

          {/* Microphone error banner if any */}
          {micError && (
            <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <p className="font-medium">Microphone Notice</p>
                <p className="text-amber-300/80 mt-0.5">{micError}</p>
                <p className="text-amber-400/90 mt-1">
                  Tip: You can always type your question directly in the chat below!
                </p>
              </div>
            </div>
          )}

          {/* Start Conversation prompt button */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>KIET / JNTUK &apos;26 · 8.08 CGPA</span>
            <button
              onClick={onScrollToChat}
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Open conversation chat ↓
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
