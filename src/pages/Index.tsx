import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { StatusIndicator } from "@/components/StatusIndicator";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AnnouncementHistory, HistoryItem } from "@/components/AnnouncementHistory";
import { BreakTimeConfig } from "@/components/BreakTimeConfig";
import { AutoAnnouncementQueue } from "@/components/AutoAnnouncementQueue";
import { DemoModeToggle } from "@/components/DemoModeToggle";
import { VoiceSelector } from "@/components/VoiceSelector";
import { BreakCountdown } from "@/components/BreakCountdown";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { defaultBreakTimes, isBreakTime, BreakTime } from "@/lib/breakTimeConfig";
import { ttsService } from "@/lib/textToSpeech";
import { checkAndAutoPlay } from "@/lib/autoAnnouncement";
import { toast } from "sonner";

const Index = () => {
  const [breakTimes, setBreakTimes] = useState<BreakTime[]>(defaultBreakTimes);
  const [canBroadcast, setCanBroadcast] = useState(false);
  const [currentScript, setCurrentScript] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Register service worker for offline support
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Check break time status every 10 seconds & auto-play queued announcements
  useEffect(() => {
    const checkBreakTime = () => {
      // In demo mode, always allow broadcasting
      if (demoMode) {
        setCanBroadcast(true);
        return;
      }

      const { isBreak } = isBreakTime(breakTimes);
      setCanBroadcast(isBreak);

      // Auto-play queued announcements when break starts
      if (!isPlaying) {
        checkAndAutoPlay(
          breakTimes,
          (script) => {
            setCurrentScript(script);
            setIsEmergency(false);
            setIsPlaying(true);
            toast.success("🎙️ Auto-broadcasting queued announcements!");
            const newItem: HistoryItem = {
              id: `${Date.now()}`,
              script,
              isEmergency: false,
              timestamp: new Date(),
              category: "Auto Queue",
            };
            setHistory((prev) => [newItem, ...prev].slice(0, 20));
          },
          () => setIsPlaying(false)
        );
      }
    };

    checkBreakTime();
    const interval = setInterval(checkBreakTime, 10000); // Check every 10s for faster response

    return () => clearInterval(interval);
  }, [breakTimes, isPlaying, demoMode]);

  const handleBroadcast = (script: string, emergency: boolean) => {
    if (!emergency && !canBroadcast) {
      return;
    }

    // Duplicate detection with toast warning
    const recentDuplicate = history.find(
      (item) =>
        item.script === script &&
        Date.now() - item.timestamp.getTime() < 300000
    );

    if (recentDuplicate && !emergency) {
      toast.warning("⚠️ This announcement was recently played. Broadcasting again.");
    }

    setCurrentScript(script);
    setIsEmergency(emergency);
    setIsPlaying(true);

    const newItem: HistoryItem = {
      id: `${Date.now()}`,
      script,
      isEmergency: emergency,
      timestamp: new Date(),
      category: emergency ? "Emergency" : "General",
    };
    setHistory((prev) => [newItem, ...prev].slice(0, 20));

    ttsService.speak(
      script,
      { rate: 0.9, volume: 1, voice: selectedVoice },
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
      { rate: 0.9, volume: 1, voice: selectedVoice },
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const breakStatus = isBreakTime(breakTimes);

  return (
    <div className="min-h-screen bg-background">
      <Header isPlaying={isPlaying} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          {/* Top Bar: Demo Mode, Offline, Countdown */}
          <div className="flex flex-wrap items-center gap-2">
            <DemoModeToggle enabled={demoMode} onToggle={setDemoMode} />
            <OfflineIndicator />
            <BreakCountdown breakTimes={breakTimes} isBreak={demoMode || breakStatus.isBreak} />
            <div className="flex-1" />
            <AutoAnnouncementQueue isPlaying={isPlaying} />
            <BreakTimeConfig breakTimes={breakTimes} onUpdate={setBreakTimes} />
          </div>

          {/* Status Section */}
          <section>
            <StatusIndicator breakTimes={breakTimes} demoMode={demoMode} />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Announcement Form - Takes 2 columns */}
            <section className="lg:col-span-2 rounded-xl bg-card border border-border p-6 card-shadow">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg radio-gradient flex items-center justify-center text-sm">📢</span>
                  Create Announcement
                </h2>
              </div>
              
              {/* Voice Selector */}
              <div className="mb-6">
                <VoiceSelector onVoiceChange={setSelectedVoice} />
              </div>

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

          {/* Feature Badges */}
          <section className="flex flex-wrap justify-center gap-3 py-4">
            {[
              "🎙️ AI RJ Mode",
              "⏰ Auto-Broadcast",
              "🚨 Emergency Override",
              "📶 Works Offline",
              "🔊 Voice Selection",
              "📋 Queue System",
            ].map((feature) => (
              <span
                key={feature}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </section>

          {/* Demo Info */}
          <section className="text-center py-6 border-t border-border">
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
