import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { BreakTime, getNextBreakTime } from "@/lib/breakTimeConfig";
import { cn } from "@/lib/utils";

interface BreakCountdownProps {
  breakTimes: BreakTime[];
  isBreak: boolean;
}

export const BreakCountdown = ({ breakTimes, isBreak }: BreakCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      if (isBreak) {
        // Find current break and show time remaining
        for (const bt of breakTimes) {
          if (!bt.enabled) continue;
          const start = bt.startHour * 60 + bt.startMinute;
          const end = bt.endHour * 60 + bt.endMinute;
          if (nowMinutes >= start && nowMinutes < end) {
            const remaining = end - nowMinutes;
            setTimeLeft(`${remaining}m left in break`);
            return;
          }
        }
        setTimeLeft("");
      } else {
        const next = getNextBreakTime(breakTimes);
        if (next) {
          const nextStart = next.startHour * 60 + next.startMinute;
          const diff = nextStart - nowMinutes;
          if (diff > 0) {
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            setTimeLeft(h > 0 ? `${h}h ${m}m to next break` : `${m}m to next break`);
          } else {
            setTimeLeft("Tomorrow");
          }
        } else {
          setTimeLeft("No breaks scheduled");
        }
      }
    };

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [breakTimes, isBreak]);

  if (!timeLeft) return null;

  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
      isBreak 
        ? "bg-success/20 text-success" 
        : "bg-muted text-muted-foreground"
    )}>
      <Timer className="w-3 h-3" />
      {timeLeft}
    </div>
  );
};
