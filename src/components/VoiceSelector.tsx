import { useState, useEffect } from "react";
import { Volume2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ttsService } from "@/lib/textToSpeech";

interface VoiceSelectorProps {
  onVoiceChange: (voice: SpeechSynthesisVoice | null) => void;
}

export const VoiceSelector = ({ onVoiceChange }: VoiceSelectorProps) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  useEffect(() => {
    const loadVoices = () => {
      const available = ttsService.getVoices();
      setVoices(available);
      // Auto-select Indian English or first English voice
      const indian = ttsService.getIndianEnglishVoice();
      if (indian) {
        setSelectedVoice(indian.name);
      }
    };

    loadVoices();
    // Voices may load async
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    const voice = voices.find((v) => v.name === voiceName) || null;
    onVoiceChange(voice);
  };

  const englishVoices = voices.filter((v) => v.lang.startsWith("en"));

  return (
    <div className="space-y-2">
      <Label className="text-foreground font-display font-semibold flex items-center gap-2 text-sm">
        <Volume2 className="w-4 h-4 text-primary" />
        Voice
      </Label>
      <Select value={selectedVoice} onValueChange={handleChange}>
        <SelectTrigger className="bg-secondary border-border text-sm h-9">
          <SelectValue placeholder="Auto (Indian English)" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border max-h-48">
          {englishVoices.length === 0 ? (
            <SelectItem value="default" disabled>
              Loading voices...
            </SelectItem>
          ) : (
            englishVoices.map((voice) => (
              <SelectItem key={voice.name} value={voice.name} className="text-sm">
                {voice.name.length > 30 ? voice.name.slice(0, 30) + "…" : voice.name}
                <span className="text-muted-foreground ml-1 text-xs">({voice.lang})</span>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
