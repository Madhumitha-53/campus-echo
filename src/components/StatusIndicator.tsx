import { useEffect, useState } from "react";
import { Clock, Radio, AlertTriangle, CheckCircle } from "lucide-react";
import { isBreakTime, getNextBreakTime, formatTime, BreakTime } from "@/lib/breakTimeConfig";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  breakTimes: BreakTime[];
  demoMode?: boolean;
}

export const StatusIndicator = ({ breakTimes, demoMode = false }: StatusIndicatorProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<{ isBreak: boolean; currentBreak: BreakTime | null }>({ 
    isBreak: false, 
    currentBreak: null 
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (demoMode) {
        setStatus({ isBreak: true, currentBreak: { id: 'demo', name: 'Demo Mode', startHour: 0, startMinute: 0, endHour: 23, endMinute: 59, enabled: true } });
      } else {
        setStatus(isBreakTime(breakTimes));
      }
    }, 1000);

    if (demoMode) {
      setStatus({ isBreak: true, currentBreak: { id: 'demo', name: 'Demo Mode', startHour: 0, startMinute: 0, endHour: 23, endMinute: 59, enabled: true } });
    } else {
      setStatus(isBreakTime(breakTimes));
    }

    return () => clearInterval(timer);
  }, [breakTimes, demoMode]);

  const nextBreak = !status.isBreak ? getNextBreakTime(breakTimes) : null;

  return (
    <div className={cn(
      "rounded-xl p-4 card-shadow transition-all duration-500",
      status.isBreak 
        ? "bg-success/20 border border-success/30" 
        : "bg-secondary border border-border"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
            status.isBreak 
              ? "bg-success/30" 
              : "bg-muted"
          )}>
            {status.isBreak ? (
              <Radio className="w-6 h-6 text-success" />
            ) : (
              <Clock className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                status.isBreak ? "bg-success animate-pulse" : "bg-muted-foreground"
              )} />
              <span className={cn(
                "font-display font-semibold",
                status.isBreak ? "text-success" : "text-foreground"
              )}>
                {status.isBreak ? "Break Time Active" : "Class Time – Auto Broadcast Paused"}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              {status.isBreak && status.currentBreak ? (
                <>Currently: {status.currentBreak.name}</>
              ) : nextBreak ? (
                <>Next break: {nextBreak.name} at {formatTime(nextBreak.startHour, nextBreak.startMinute)}</>
              ) : (
                <>No upcoming breaks scheduled</>
              )}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-display font-bold text-foreground">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {status.isBreak && (
        <div className="mt-3 flex items-center gap-2 text-success">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Broadcasting enabled</span>
        </div>
      )}

      {!status.isBreak && (
        <div className="mt-3 flex items-center gap-2 text-muted-foreground">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Normal broadcasts paused. Emergency broadcasts always available.</span>
        </div>
      )}
    </div>
  );
};
