import { useState, useEffect } from "react";
import { TestTube, Timer } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DemoModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const DemoModeToggle = ({ enabled, onToggle }: DemoModeToggleProps) => {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
      enabled 
        ? "bg-success/10 border-success/30" 
        : "bg-secondary border-border"
    )}>
      <TestTube className={cn("w-4 h-4", enabled ? "text-success" : "text-muted-foreground")} />
      <Label htmlFor="demo-mode" className={cn(
        "text-sm font-medium cursor-pointer",
        enabled ? "text-success" : "text-muted-foreground"
      )}>
        Demo
      </Label>
      <Switch
        id="demo-mode"
        checked={enabled}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-success"
      />
    </div>
  );
};
