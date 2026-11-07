import React from 'react';
import { X, Volume2, Mic, Play, RotateCcw } from 'lucide-react';
import { VoiceSettings } from '../types/assistant';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onUpdateSettings: (newSettings: Partial<VoiceSettings>) => void;
  availableVoices: SpeechSynthesisVoice[];
  onTestVoice: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  availableVoices,
  onTestVoice,
}) => {
  if (!isOpen) return null;

  // Filter english voices or sort
  const englishVoices = availableVoices.filter((v) => v.lang.startsWith('en'));
  const otherVoices = availableVoices.filter((v) => !v.lang.startsWith('en'));
  const displayedVoices = [...englishVoices, ...otherVoices];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0c101c] border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Voice & Speech Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-5">
          {/* Auto Speak Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-white">Auto-Speak Responses</p>
              <p className="text-[11px] text-slate-400">Automatically vocalize AI answers as they arrive</p>
            </div>
            <button
              onClick={() => onUpdateSettings({ autoSpeak: !settings.autoSpeak })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.autoSpeak ? 'bg-purple-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.autoSpeak ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Voice Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Speech Synthesis Voice
            </label>
            <select
              value={settings.voiceURI || ''}
              onChange={(e) => onUpdateSettings({ voiceURI: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {displayedVoices.length === 0 ? (
                <option value="">Default System Voice</option>
              ) : (
                displayedVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Speed / Rate */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Speaking Speed</span>
              <span className="font-mono text-purple-400">{settings.rate.toFixed(1)}x</span>
            </div>
            <div className="flex items-center gap-2">
              {[0.8, 1.0, 1.2].map((r) => (
                <button
                  key={r}
                  onClick={() => onUpdateSettings({ rate: r })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    settings.rate === r
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}x {r === 1.0 ? '(Normal)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Pitch */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span>Voice Pitch</span>
              <span className="font-mono text-purple-400">{settings.pitch.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              {[0.9, 1.0, 1.1].map((p) => (
                <button
                  key={p}
                  onClick={() => onUpdateSettings({ pitch: p })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    settings.pitch === p
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p} {p === 1.0 ? '(Natural)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Test Voice Button */}
          <button
            onClick={onTestVoice}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors border border-slate-700/60"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Test Saranya Voice Output</span>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
