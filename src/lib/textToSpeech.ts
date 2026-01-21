export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
}

class TextToSpeechService {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isReady: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
    this.isReady = this.voices.length > 0;
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  getIndianEnglishVoice(): SpeechSynthesisVoice | null {
    // Try to find Indian English voice
    let voice = this.voices.find(v => 
      v.lang.includes('en-IN') || 
      v.name.toLowerCase().includes('indian') ||
      v.name.toLowerCase().includes('india')
    );

    // Fallback to any English voice
    if (!voice) {
      voice = this.voices.find(v => v.lang.startsWith('en'));
    }

    // Fallback to first available voice
    if (!voice && this.voices.length > 0) {
      voice = this.voices[0];
    }

    return voice || null;
  }

  speak(
    text: string, 
    options: SpeechOptions = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): void {
    // Cancel any ongoing speech
    this.stop();

    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    const voice = options.voice || this.getIndianEnglishVoice();
    if (voice) {
      this.utterance.voice = voice;
    }

    // Set options with defaults
    this.utterance.rate = options.rate ?? 0.9;
    this.utterance.pitch = options.pitch ?? 1.0;
    this.utterance.volume = options.volume ?? 1.0;

    // Event handlers
    this.utterance.onstart = () => {
      onStart?.();
    };

    this.utterance.onend = () => {
      onEnd?.();
    };

    this.utterance.onerror = (event) => {
      onError?.(event.error);
    };

    // Start speaking
    this.synthesis.speak(this.utterance);
  }

  stop(): void {
    this.synthesis.cancel();
    this.utterance = null;
  }

  pause(): void {
    this.synthesis.pause();
  }

  resume(): void {
    this.synthesis.resume();
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  isPaused(): boolean {
    return this.synthesis.paused;
  }
}

export const ttsService = new TextToSpeechService();
