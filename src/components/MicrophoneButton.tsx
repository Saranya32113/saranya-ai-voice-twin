import React from 'react';
import { Mic, MicOff, Square, Loader2 } from 'lucide-react';
import { VoiceState } from '../types/assistant';

interface MicrophoneButtonProps {
  state: VoiceState;
  onToggleListen: () => void;
  onStopSpeaking: () => void;
  disabled?: boolean;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  state,
  onToggleListen,
  onStopSpeaking,
  disabled = false,
}) => {
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';

  const handleClick = () => {
    if (disabled) return;
    if (isSpeaking) {
      onStopSpeaking();
    } else {
      onToggleListen();
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Concentric radiant pulse rings when listening */}
      {isListening && (
        <>
          <span className="absolute -inset-3 rounded-full bg-purple-500/30 animate-ping opacity-75" />
          <span className="absolute -inset-6 rounded-full bg-indigo-500/20 animate-pulse" />
          <span className="absolute -inset-9 rounded-full bg-sky-500/10 animate-pulse" />
        </>
      )}

      {/* Radiant glow when speaking */}
      {isSpeaking && (
        <span className="absolute -inset-3 rounded-full bg-gradient-to-r from-purple-600/40 to-blue-600/40 animate-pulse" />
      )}

      {/* Button Body */}
      <button
        onClick={handleClick}
        disabled={disabled || isThinking}
        aria-label={
          isListening
            ? 'Stop listening'
            : isSpeaking
            ? 'Stop speech playback'
            : isThinking
            ? 'Saranya is thinking...'
            : 'Click to speak to Saranya'
        }
        className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-xl ${
          isListening
            ? 'bg-gradient-to-br from-red-500 via-rose-600 to-purple-600 text-white shadow-rose-500/40 ring-4 ring-rose-400/50 scale-105'
            : isSpeaking
            ? 'bg-gradient-to-br from-amber-500 via-orange-600 to-purple-600 text-white shadow-amber-500/40 ring-4 ring-amber-400/50'
            : isThinking
            ? 'bg-gradient-to-br from-indigo-800 to-purple-900 text-purple-200 cursor-wait'
            : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500 text-white shadow-purple-600/30 ring-2 ring-purple-400/30 hover:scale-105'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? (
          <MicOff className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse text-white" />
        ) : isSpeaking ? (
          <Square className="w-6 h-6 sm:w-7 sm:h-7 fill-current text-white" />
        ) : isThinking ? (
          <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-purple-200" />
        ) : (
          <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-white transition-transform group-hover:scale-110" />
        )}
      </button>
    </div>
  );
};
