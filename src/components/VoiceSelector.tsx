import { useState, useEffect } from "react";
import { Volume2, Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ttsService } from "@/lib/textToSpeech";

export interface Language {
  code: string;
  label: string;
  flag: string;
}

export const supportedLanguages: Language[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ta", label: "Tamil", flag: "🇮🇳" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
];

interface VoiceSelectorProps {
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void;
  onLanguageChange?: (lang: Language) => void;
}

export const VoiceSelector = ({ onVoiceChange, onLanguageChange }: VoiceSelectorProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  useEffect(() => {
    const loadVoices = () => {
      const available = ttsService.getVoices();
      setVoices(available);
      // Auto-select Indian English
      const indian = ttsService.getIndianEnglishVoice();
      if (indian && !selectedVoice) {
        setSelectedVoice(indian.name);
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // When language changes, auto-pick first matching voice
  useEffect(() => {
    const matching = voices.filter((v) => v.lang.startsWith(selectedLang));
    if (matching.length > 0) {
      setSelectedVoice(matching[0].name);
      onVoiceChange(matching[0]);
    } else {
      setSelectedVoice("");
      onVoiceChange(null);
    }
    const lang = supportedLanguages.find((l) => l.code === selectedLang);
    if (lang) onLanguageChange?.(lang);
  }, [selectedLang, voices]);

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    const voice = voices.find((v) => v.name === voiceName) || null;
    onVoiceChange(voice);
  };

  const filteredVoices = voices.filter((v) => v.lang.startsWith(selectedLang));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Language Selector */}
      <div className="space-y-2">
        <Label className="text-foreground font-display font-semibold flex items-center gap-2 text-sm">
          <Globe className="w-4 h-4 text-primary" />
          Language
        </Label>
        <Select value={selectedLang} onValueChange={setSelectedLang}>
          <SelectTrigger className="bg-secondary border-border text-sm h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {supportedLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code} className="text-sm">
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Voice Selector */}
      <div className="space-y-2">
        <Label className="text-foreground font-display font-semibold flex items-center gap-2 text-sm">
          <Volume2 className="w-4 h-4 text-primary" />
          Voice
        </Label>
        <Select value={selectedVoice} onValueChange={handleVoiceChange}>
          <SelectTrigger className="bg-secondary border-border text-sm h-9">
            <SelectValue placeholder={filteredVoices.length === 0 ? "No voices available" : "Select voice"} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border max-h-48">
            {filteredVoices.length === 0 ? (
              <SelectItem value="none" disabled className="text-sm text-muted-foreground">
                No voices for this language
              </SelectItem>
            ) : (
              filteredVoices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name} className="text-sm">
                  {voice.name.length > 28 ? voice.name.slice(0, 28) + "…" : voice.name}
                  <span className="text-muted-foreground ml-1 text-xs">({voice.lang})</span>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
