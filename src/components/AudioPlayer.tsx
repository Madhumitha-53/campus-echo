import { useState, useEffect } from "react";
import { Play, Pause, Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SoundWaveVisualizer } from "./SoundWaveVisualizer";
import { ttsService } from "@/lib/textToSpeech";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  script: string;
  isEmergency: boolean;
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
}

export const AudioPlayer = ({ 
  script, 
  isEmergency, 
  isPlaying,
  onPlayingChange 
}: AudioPlayerProps) => {
  const [volume, setVolume] = useState(100);
  const [rate, setRate] = useState(90);

  const handlePlay = () => {
    if (!script) return;
    
    ttsService.speak(
      script,
      { 
        rate: rate / 100,
        volume: volume / 100,
      },
      () => onPlayingChange(true),
      () => onPlayingChange(false),
      () => onPlayingChange(false)
    );
  };

  const handleStop = () => {
    ttsService.stop();
    onPlayingChange(false);
  };

  const handlePause = () => {
    if (ttsService.isPaused()) {
      ttsService.resume();
    } else {
      ttsService.pause();
    }
  };

  useEffect(() => {
    // Auto-play when script changes and isPlaying is triggered externally
    if (script && isPlaying && !ttsService.isSpeaking()) {
      handlePlay();
    }
  }, [script, isPlaying]);

  if (!script) return null;

  return (
    <div className={cn(
      "rounded-xl p-6 card-shadow transition-all duration-500",
      isEmergency 
        ? "bg-emergency/10 border-2 border-emergency glow-emergency" 
        : "bg-secondary border border-border"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            isEmergency ? "bg-emergency/20" : "bg-primary/20"
          )}>
            {isPlaying && (
              <div className={cn(
                "w-10 h-10 rounded-full absolute animate-pulse-ring",
                isEmergency ? "bg-emergency/30" : "bg-primary/30"
              )} />
            )}
            <SoundWaveVisualizer 
              isPlaying={isPlaying} 
              barCount={3}
              className={isEmergency ? "text-emergency" : ""}
            />
          </div>
          <div>
            <h3 className={cn(
              "font-display font-bold",
              isEmergency ? "text-emergency" : "text-primary"
            )}>
              {isEmergency ? "🚨 Emergency Broadcast" : "📻 Now Broadcasting"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isPlaying ? "Audio playing..." : "Ready to play"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying ? (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePause}
                className="border-border"
              >
                <Pause className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleStop}
                className="border-border hover:bg-emergency/20 hover:border-emergency"
              >
                <Square className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handlePlay}
              className={cn(
                "font-semibold",
                isEmergency 
                  ? "emergency-gradient text-white" 
                  : "radio-gradient text-primary-foreground"
              )}
            >
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
          )}
        </div>
      </div>

      {/* Script Preview */}
      <div className="p-4 rounded-lg bg-background/50 mb-4">
        <p className="text-sm text-foreground/80 leading-relaxed italic line-clamp-3">
          "{script}"
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Volume2 className="w-3 h-3" /> Volume
            </span>
            <span className="text-sm font-medium text-foreground">{volume}%</span>
          </div>
          <Slider
            value={[volume]}
            onValueChange={([v]) => setVolume(v)}
            max={100}
            step={1}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Speed</span>
            <span className="text-sm font-medium text-foreground">{rate}%</span>
          </div>
          <Slider
            value={[rate]}
            onValueChange={([r]) => setRate(r)}
            min={50}
            max={150}
            step={5}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
