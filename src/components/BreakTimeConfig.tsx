import { useState } from "react";
import { Clock, Plus, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BreakTime, formatTime } from "@/lib/breakTimeConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface BreakTimeConfigProps {
  breakTimes: BreakTime[];
  onUpdate: (breakTimes: BreakTime[]) => void;
}

export const BreakTimeConfig = ({ breakTimes, onUpdate }: BreakTimeConfigProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleBreakTime = (id: string) => {
    const updated = breakTimes.map(bt =>
      bt.id === id ? { ...bt, enabled: !bt.enabled } : bt
    );
    onUpdate(updated);
  };

  const updateBreakTime = (id: string, field: keyof BreakTime, value: number | string) => {
    const updated = breakTimes.map(bt =>
      bt.id === id ? { ...bt, [field]: value } : bt
    );
    onUpdate(updated);
  };

  const addBreakTime = () => {
    const newBreak: BreakTime = {
      id: `break-${Date.now()}`,
      name: 'New Break',
      startHour: 14,
      startMinute: 0,
      endHour: 14,
      endMinute: 15,
      enabled: true,
    };
    onUpdate([...breakTimes, newBreak]);
  };

  const removeBreakTime = (id: string) => {
    onUpdate(breakTimes.filter(bt => bt.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
          <Settings className="w-4 h-4 mr-2" />
          Configure Breaks
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Break Time Schedule
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {breakTimes.map((breakTime) => (
            <div
              key={breakTime.id}
              className={cn(
                "p-4 rounded-lg border transition-all",
                breakTime.enabled 
                  ? "bg-secondary/50 border-primary/30" 
                  : "bg-muted/30 border-border opacity-60"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <Input
                  value={breakTime.name}
                  onChange={(e) => updateBreakTime(breakTime.id, 'name', e.target.value)}
                  className="font-semibold bg-transparent border-none p-0 h-auto text-foreground focus-visible:ring-0"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={breakTime.enabled}
                    onCheckedChange={() => toggleBreakTime(breakTime.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBreakTime(breakTime.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-emergency"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Start Time</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={breakTime.startHour}
                      onChange={(e) => updateBreakTime(breakTime.id, 'startHour', parseInt(e.target.value) || 0)}
                      className="bg-secondary border-border text-center"
                    />
                    <span className="text-muted-foreground self-center">:</span>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={breakTime.startMinute}
                      onChange={(e) => updateBreakTime(breakTime.id, 'startMinute', parseInt(e.target.value) || 0)}
                      className="bg-secondary border-border text-center"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">End Time</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={breakTime.endHour}
                      onChange={(e) => updateBreakTime(breakTime.id, 'endHour', parseInt(e.target.value) || 0)}
                      className="bg-secondary border-border text-center"
                    />
                    <span className="text-muted-foreground self-center">:</span>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={breakTime.endMinute}
                      onChange={(e) => updateBreakTime(breakTime.id, 'endMinute', parseInt(e.target.value) || 0)}
                      className="bg-secondary border-border text-center"
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                {formatTime(breakTime.startHour, breakTime.startMinute)} - {formatTime(breakTime.endHour, breakTime.endMinute)}
              </p>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addBreakTime}
            className="w-full border-dashed border-border hover:bg-secondary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Break Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
