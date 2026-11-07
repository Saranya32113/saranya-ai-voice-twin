import { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceState, VoiceSettings } from '../types/assistant';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEventLike extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

export function useVoiceAssistant(onUserSpeechFinished: (text: string) => void) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState<boolean>(true);
  const [isSpeechSynthesisSupported, setIsSpeechSynthesisSupported] = useState<boolean>(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    autoSpeak: true,
    rate: 1.0,
    pitch: 1.0,
    voiceURI: null,
  });
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef<boolean>(false);
  const finalTranscriptRef = useRef<string>('');

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as WindowWithSpeechRecognition;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSpeechRecognitionSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setVoiceState('listening');
        setMicError(null);
        finalTranscriptRef.current = '';
        setTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i][0];
          if (item) {
            currentTranscript += item.transcript;
          }
        }
        setTranscript(currentTranscript);
        finalTranscriptRef.current = currentTranscript;
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error !== 'no-speech') {
          setMicError(`Microphone issue: ${event.error}`);
        }
        isListeningRef.current = false;
        setVoiceState('idle');
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));

        const finalSaid = finalTranscriptRef.current.trim();
        if (finalSaid.length > 0) {
          onUserSpeechFinished(finalSaid);
        }
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Failed to initialize speech recognition:', e);
      setIsSpeechRecognitionSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onUserSpeechFinished]);

  // Initialize Speech Synthesis and populate voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeechSynthesisSupported(false);
      return;
    }

    const populateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        setAvailableVoices(voices);

        // Auto-select a high-quality natural female English voice if not selected
        if (!voiceSettings.voiceURI) {
          const preferredVoice = voices.find(
            (v) =>
              (v.name.includes('Google UK English Female') ||
                v.name.includes('Samantha') ||
                v.name.includes('Zira') ||
                v.name.includes('Natural') ||
                v.name.includes('Female') ||
                v.lang.startsWith('en')) &&
              v.lang.includes('en')
          );
          if (preferredVoice) {
            setVoiceSettings((prev) => ({ ...prev, voiceURI: preferredVoice.voiceURI }));
          }
        }
      }
    };

    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [voiceSettings.voiceURI]);

  // Start listening to voice
  const startListening = useCallback(() => {
    // If speaking, stop speaking first
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (!recognitionRef.current) {
      setMicError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or type your question below.');
      return;
    }

    try {
      setMicError(null);
      setTranscript('');
      finalTranscriptRef.current = '';
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Error starting speech recognition:', err);
      // Restart if already running
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition:', err);
      }
    }
    setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
  }, []);

  // Speak text using SpeechSynthesis
  const speakText = useCallback(
    (textToSpeak: string, onEndCallback?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      // Clean text of markdown, asterisks, brackets for clean vocalization
      const cleanText = textToSpeak
        .replace(/[*_#`~]/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanText) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = voiceSettings.rate;
      utterance.pitch = voiceSettings.pitch;

      if (voiceSettings.voiceURI) {
        const found = availableVoices.find((v) => v.voiceURI === voiceSettings.voiceURI);
        if (found) {
          utterance.voice = found;
        }
      }

      utterance.onstart = () => {
        setVoiceState('speaking');
      };

      utterance.onend = () => {
        setVoiceState('idle');
        if (onEndCallback) onEndCallback();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance error:', e);
        setVoiceState('idle');
      };

      window.speechSynthesis.speak(utterance);
    },
    [availableVoices, voiceSettings]
  );

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState((prev) => (prev === 'speaking' ? 'idle' : prev));
  }, []);

  // Toggle voice settings
  const updateVoiceSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    voiceState,
    setVoiceState,
    transcript,
    micError,
    setMicError,
    isSpeechRecognitionSupported,
    isSpeechSynthesisSupported,
    availableVoices,
    voiceSettings,
    updateVoiceSettings,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  };
}
