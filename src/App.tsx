/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { HeroTwin } from './components/HeroTwin';
import { SuggestedQuestions } from './components/SuggestedQuestions';
import { ChatInterface } from './components/ChatInterface';
import { ProfileDrawer } from './components/ProfileDrawer';
import { InterviewLibraryModal } from './components/InterviewLibraryModal';
import { AssessmentReviewModal } from './components/AssessmentReviewModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { Footer } from './components/Footer';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { ChatMessage } from './types/assistant';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'greeting-1',
      sender: 'assistant',
      text: "Hi! I'm Saranya's AI voice twin. Ask me anything about my journey, technical skills, projects, experiences and career goals.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'knowledge_base',
    },
  ]);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentlySpokenText, setCurrentlySpokenText] = useState<string | null>(null);

  const messagesRef = useRef<ChatMessage[]>(messages);
  messagesRef.current = messages;

  // Send message to server and get Gemini response
  const handleSendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: text.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setVoiceState('thinking');

      // Check if user is asking why 100x should hire Saranya to trigger a celebratory burst
      if (text.toLowerCase().includes('100x') && text.toLowerCase().includes('hire')) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }

      try {
        const historyPayload = messagesRef.current.slice(-6).map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text.trim(),
            history: historyPayload,
          }),
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        const replyText = data.reply || "I'm sorry, could you please repeat that question?";

        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Vocalize response if auto-speak is enabled
        if (voiceSettings.autoSpeak) {
          setCurrentlySpokenText(replyText);
          speakText(replyText, () => {
            setCurrentlySpokenText(null);
          });
        } else {
          setVoiceState('idle');
        }
      } catch (err) {
        console.warn('Chat request error:', err);
        const errorMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: "I experienced a brief connection hiccup, but as Saranya Gadde, I'm always ready to share my AI/ML background, projects, or discuss why I'm excited about 100x! Please try asking again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'knowledge_base',
        };
        setMessages((prev) => [...prev, errorMsg]);
        setVoiceState('idle');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const {
    voiceState,
    setVoiceState,
    transcript,
    micError,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    availableVoices,
    voiceSettings,
    updateVoiceSettings,
  } = useVoiceAssistant(handleSendMessage);

  // Toggle listening
  const handleToggleListen = () => {
    if (voiceState === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  };

  // Replay last assistant message
  const lastAssistantMessage =
    [...messages].reverse().find((m) => m.sender === 'assistant')?.text || null;

  const handleReplayLast = () => {
    if (lastAssistantMessage) {
      setCurrentlySpokenText(lastAssistantMessage);
      speakText(lastAssistantMessage, () => {
        setCurrentlySpokenText(null);
      });
    }
  };

  const handleSpeakSingleText = (text: string) => {
    setCurrentlySpokenText(text);
    speakText(text, () => {
      setCurrentlySpokenText(null);
    });
  };

  const handleClearChat = () => {
    stopSpeaking();
    stopListening();
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        sender: 'assistant',
        text: "Hi! I'm Saranya's AI voice twin. The chat is refreshed. Ask me anything about my journey, technical skills, projects, and career goals.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'knowledge_base',
      },
    ]);
  };

  const scrollToChat = () => {
    document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06080F] text-slate-100 selection:bg-purple-600/30 selection:text-purple-200">
      {/* Top Bar Header */}
      <Header
        activeSection="twin"
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenQuestions={() => setIsQuestionsOpen(true)}
        onOpenAssessment={() => setIsAssessmentOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        voiceSettings={voiceSettings}
        onToggleAutoSpeak={() => updateVoiceSettings({ autoSpeak: !voiceSettings.autoSpeak })}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center w-full">
        {/* Hero Digital Twin Stage */}
        <HeroTwin
          voiceState={voiceState}
          transcript={transcript}
          micError={micError}
          onToggleListen={handleToggleListen}
          onStopSpeaking={stopSpeaking}
          onReplayLastAnswer={handleReplayLast}
          lastAssistantMessage={lastAssistantMessage}
          onScrollToChat={scrollToChat}
          voiceSettings={voiceSettings}
        />

        {/* Suggested Interview Question Prompts */}
        <SuggestedQuestions
          onSelectQuestion={(q) => {
            handleSendMessage(q);
            scrollToChat();
          }}
          onOpenLibrary={() => setIsQuestionsOpen(true)}
          disabled={voiceState === 'thinking'}
        />

        {/* Conversational Chat Interface */}
        <ChatInterface
          messages={messages}
          voiceState={voiceState}
          onSendMessage={handleSendMessage}
          onToggleListen={handleToggleListen}
          onSpeakText={handleSpeakSingleText}
          onStopSpeaking={stopSpeaking}
          onClearChat={handleClearChat}
          currentlySpokenText={currentlySpokenText}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenQuestions={() => setIsQuestionsOpen(true)}
        onOpenAssessment={() => setIsAssessmentOpen(true)}
      />

      {/* Profile & Verified Background Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onAskAboutProject={(projTitle) => {
          handleSendMessage(`Explain your ${projTitle} project.`);
          scrollToChat();
        }}
      />

      {/* 20 Assessment Questions Library Modal */}
      <InterviewLibraryModal
        isOpen={isQuestionsOpen}
        onClose={() => setIsQuestionsOpen(false)}
        onAskQuestion={(question) => {
          handleSendMessage(question);
          scrollToChat();
        }}
      />

      {/* 100x Assessment Verification Modal */}
      <AssessmentReviewModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
      />

      {/* Voice & Speech Synthesis Settings Modal */}
      <VoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={voiceSettings}
        onUpdateSettings={updateVoiceSettings}
        availableVoices={availableVoices}
        onTestVoice={() => {
          speakText("Hello! I am Saranya Gadde's AI voice twin, ready for the 100x assessment.");
        }}
      />
    </div>
  );
}
