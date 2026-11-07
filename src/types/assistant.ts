export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'knowledge_base';
}

export interface VoiceSettings {
  autoSpeak: boolean;
  rate: number; // 0.8 - 1.2
  pitch: number; // 0.8 - 1.2
  voiceURI: string | null;
}
