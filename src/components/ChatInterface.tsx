import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, Square, Copy, Check, Trash2, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage, VoiceState } from '../types/assistant';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  voiceState: VoiceState;
  onSendMessage: (text: string) => void;
  onToggleListen: () => void;
  onSpeakText: (text: string) => void;
  onStopSpeaking: () => void;
  onClearChat: () => void;
  currentlySpokenText?: string | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  voiceState,
  onSendMessage,
  onToggleListen,
  onSpeakText,
  onStopSpeaking,
  onClearChat,
  currentlySpokenText,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, voiceState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || voiceState === 'thinking') return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div id="chat-section" className="w-full max-w-4xl mx-auto px-4 mb-16">
      <div className="rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col h-[580px] sm:h-[620px]">
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Saranya Gadde · Digital Twin</h3>
              <p className="text-xs text-slate-400">Interactive First-Person Voice Chat</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={onClearChat}
                title="Clear conversation"
                className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/70 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">
                Conversation Session Ready
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-4">
                Tap the microphone or choose a suggested question above to start interviewing Saranya about her background, projects, and career aspirations.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isCurrentlyPlaying = voiceState === 'speaking' && currentlySpokenText === msg.text;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-purple-900/30">
                      <span className="text-xs font-bold">SG</span>
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition-all ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md shadow-indigo-900/20'
                        : 'bg-slate-800/80 border border-slate-700/60 text-slate-100 rounded-bl-none shadow-md'
                    }`}
                  >
                    {/* Speaker Header */}
                    <div className="flex items-center justify-between text-xs text-slate-300/80 mb-1.5 gap-4">
                      <span className="font-semibold text-xs">
                        {isUser ? 'You (Interviewer)' : 'Saranya Gadde'}
                      </span>
                      <span className="text-[11px] opacity-70">{msg.timestamp}</span>
                    </div>

                    {/* Text Body */}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap selection:bg-purple-400/30">
                      {msg.text}
                    </p>

                    {/* Action Bar for Assistant Messages */}
                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                        <span className="text-[10px] uppercase tracking-wider text-purple-400/80 font-medium">
                          {msg.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Grounded Twin'}
                        </span>

                        <div className="flex items-center gap-2">
                          {/* Speak / Stop Button */}
                          <button
                            onClick={() => {
                              if (isCurrentlyPlaying) {
                                onStopSpeaking();
                              } else {
                                onSpeakText(msg.text);
                              }
                            }}
                            className={`p-1.5 rounded-md hover:bg-slate-700 transition-colors flex items-center gap-1 ${
                              isCurrentlyPlaying ? 'text-purple-300 bg-purple-900/40' : 'text-slate-300'
                            }`}
                            title={isCurrentlyPlaying ? 'Stop playback' : 'Play answer with voice'}
                          >
                            {isCurrentlyPlaying ? (
                              <>
                                <Square className="w-3.5 h-3.5 fill-current text-purple-300" />
                                <span className="text-[11px]">Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Listen</span>
                              </>
                            )}
                          </button>

                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1"
                            title="Copy answer to clipboard"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[11px] text-emerald-300">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Thinking Indicator */}
          {voiceState === 'thinking' && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md">
                <span className="text-xs font-bold">SG</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-bl-none p-4 shadow-md max-w-sm">
                <div className="flex items-center gap-2 text-xs text-purple-300 font-medium mb-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>Saranya is synthesizing answer...</span>
                </div>
                <div className="flex items-center gap-1.5 py-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Text Input & Mic Control Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/90 flex items-center gap-2"
        >
          {/* Quick Voice Mic Button */}
          <button
            type="button"
            onClick={onToggleListen}
            title={voiceState === 'listening' ? 'Stop listening' : 'Start voice input'}
            className={`p-3 rounded-xl border transition-all shrink-0 ${
              voiceState === 'listening'
                ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-purple-500/50'
            }`}
          >
            {voiceState === 'listening' ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={voiceState === 'thinking'}
            placeholder="Type your interview question (e.g. 'Tell me about your plant disease project')..."
            className="flex-1 bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || voiceState === 'thinking'}
            className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-purple-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Send question"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
