import { Clock, Radio, AlertOctagon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  script: string;
  isEmergency: boolean;
  timestamp: Date;
  category: string;
}

interface AnnouncementHistoryProps {
  history: HistoryItem[];
  onReplay: (script: string, isEmergency: boolean) => void;
  isPlaying: boolean;
}

export const AnnouncementHistory = ({ 
  history, 
  onReplay,
  isPlaying 
}: AnnouncementHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Radio className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No announcements yet</p>
        <p className="text-sm">Create your first broadcast above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        Recent Broadcasts
      </h3>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {history.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-3 rounded-lg border transition-all hover:border-primary/50",
              item.isEmergency 
                ? "bg-emergency/5 border-emergency/20" 
                : "bg-secondary/50 border-border"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {item.isEmergency ? (
                    <AlertOctagon className="w-4 h-4 text-emergency flex-shrink-0" />
                  ) : (
                    <Radio className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    item.isEmergency 
                      ? "bg-emergency/20 text-emergency" 
                      : "bg-primary/20 text-primary"
                  )}>
                    {item.isEmergency ? 'Emergency' : item.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-foreground/70 line-clamp-2">
                  {item.script}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onReplay(item.script, item.isEmergency)}
                disabled={isPlaying}
                className="h-8 w-8 flex-shrink-0 hover:bg-primary/20"
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
