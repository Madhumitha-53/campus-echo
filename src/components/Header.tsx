import { Radio, Waves } from "lucide-react";
import { SoundWaveVisualizer } from "./SoundWaveVisualizer";

interface HeaderProps {
  isPlaying: boolean;
}

export const Header = ({ isPlaying }: HeaderProps) => {
  return (
    <header className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

      <div className="relative container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-2xl radio-gradient flex items-center justify-center glow-primary relative">
              {isPlaying && (
                <div className="absolute inset-0 rounded-2xl animate-pulse-ring bg-primary/30" />
              )}
              <Radio className="w-10 h-10 text-primary-foreground" />
            </div>
            
            {/* Floating waves */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2">
              <SoundWaveVisualizer isPlaying={isPlaying} barCount={3} />
            </div>
            <div className="absolute -right-8 top-1/2 -translate-y-1/2">
              <SoundWaveVisualizer isPlaying={isPlaying} barCount={3} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
            Campus <span className="text-primary">FM</span>
          </h1>
          
          <p className="text-muted-foreground max-w-md">
            The official voice of our college • Smart Audio Announcements
          </p>

          {/* Live indicator */}
          {isPlaying && (
            <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-emergency/20 border border-emergency/30">
              <div className="w-2 h-2 rounded-full bg-emergency animate-pulse" />
              <span className="text-sm font-medium text-emergency">LIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </header>
  );
};
