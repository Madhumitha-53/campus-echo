import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { StatusIndicator } from "@/components/StatusIndicator";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AnnouncementHistory, HistoryItem } from "@/components/AnnouncementHistory";
import { BreakTimeConfig } from "@/components/BreakTimeConfig";
import { defaultBreakTimes, isBreakTime, BreakTime } from "@/lib/breakTimeConfig";
import { ttsService } from "@/lib/textToSpeech";

const Index = () => {
  const [breakTimes, setBreakTimes] = useState<BreakTime[]>(defaultBreakTimes);
  const [canBroadcast, setCanBroadcast] = useState(false);
  const [currentScript, setCurrentScript] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Check break time status every minute
  useEffect(() => {
    const checkBreakTime = () => {
      const { isBreak } = isBreakTime(breakTimes);
      setCanBroadcast(isBreak);
    };

    checkBreakTime();
    const interval = setInterval(checkBreakTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [breakTimes]);

  const handleBroadcast = (script: string, emergency: boolean) => {
    // Check if we can broadcast (break time or emergency)
    if (!emergency && !canBroadcast) {
      return;
    }

    // Check if same announcement was already played this session
    const recentDuplicate = history.find(
      item => item.script === script && 
      Date.now() - item.timestamp.getTime() < 300000 // Within 5 minutes
    );

    if (recentDuplicate && !emergency) {
      // Allow replay but warn (could add toast here)
    }

    setCurrentScript(script);
    setIsEmergency(emergency);
    setIsPlaying(true);

    // Add to history
    const newItem: HistoryItem = {
      id: `${Date.now()}`,
      script,
      isEmergency: emergency,
      timestamp: new Date(),
      category: emergency ? 'Emergency' : 'General',
    };
    setHistory(prev => [newItem, ...prev].slice(0, 10)); // Keep last 10

    // Start TTS
    ttsService.speak(
      script,
      { rate: 0.9, volume: 1 },
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const handleReplay = (script: string, emergency: boolean) => {
    setCurrentScript(script);
    setIsEmergency(emergency);
    setIsPlaying(true);

    ttsService.speak(
      script,
      { rate: 0.9, volume: 1 },
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isPlaying={isPlaying} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          {/* Status Section */}
          <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full">
              <StatusIndicator breakTimes={breakTimes} />
            </div>
            <BreakTimeConfig breakTimes={breakTimes} onUpdate={setBreakTimes} />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Announcement Form - Takes 2 columns */}
            <section className="lg:col-span-2 rounded-xl bg-card border border-border p-6 card-shadow">
              <h2 className="font-display font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg radio-gradient flex items-center justify-center text-sm">📢</span>
                Create Announcement
              </h2>
              <AnnouncementForm 
                onBroadcast={handleBroadcast}
                canBroadcast={canBroadcast}
                isPlaying={isPlaying}
              />
            </section>

            {/* History Sidebar */}
            <section className="rounded-xl bg-card border border-border p-6 card-shadow">
              <AnnouncementHistory 
                history={history}
                onReplay={handleReplay}
                isPlaying={isPlaying}
              />
            </section>
          </div>

          {/* Audio Player */}
          {currentScript && (
            <section>
              <AudioPlayer
                script={currentScript}
                isEmergency={isEmergency}
                isPlaying={isPlaying}
                onPlayingChange={setIsPlaying}
              />
            </section>
          )}

          {/* Demo Info */}
          <section className="text-center py-8 border-t border-border">
            <p className="text-muted-foreground text-sm">
              🎓 Smart Campus Audio Announcement System • Hackathon Demo
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Powered by Web Speech API • No backend required • Works offline
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
