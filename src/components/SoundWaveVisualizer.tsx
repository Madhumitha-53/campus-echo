import { cn } from "@/lib/utils";

interface SoundWaveVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export const SoundWaveVisualizer = ({ 
  isPlaying, 
  barCount = 5,
  className 
}: SoundWaveVisualizerProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {Array.from({ length: barCount }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-1 bg-primary rounded-full transition-all duration-200",
            isPlaying ? "animate-sound-wave" : "h-2"
          )}
          style={{
            height: isPlaying ? undefined : '8px',
            animationDelay: isPlaying ? `${index * 0.15}s` : undefined,
            minHeight: '8px',
            maxHeight: '24px',
          }}
        />
      ))}
    </div>
  );
};
