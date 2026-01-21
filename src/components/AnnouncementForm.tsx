import { useState } from "react";
import { Mic, Radio, AlertOctagon, Send, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  AnnouncementCategory, 
  Department, 
  categories, 
  departments,
  generateRJScript 
} from "@/lib/rjScriptGenerator";
import { cn } from "@/lib/utils";

interface AnnouncementFormProps {
  onBroadcast: (script: string, isEmergency: boolean) => void;
  canBroadcast: boolean;
  isPlaying: boolean;
}

export const AnnouncementForm = ({ 
  onBroadcast, 
  canBroadcast, 
  isPlaying 
}: AnnouncementFormProps) => {
  const [announcement, setAnnouncement] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("general");
  const [department, setDepartment] = useState<Department>("ALL");
  const [previewScript, setPreviewScript] = useState("");

  const handlePreview = () => {
    if (!announcement.trim()) return;
    const script = generateRJScript(announcement, category, department);
    setPreviewScript(script);
  };

  const handleBroadcast = (isEmergency: boolean) => {
    if (!announcement.trim()) return;
    const cat = isEmergency ? 'emergency' : category;
    const script = generateRJScript(announcement, cat, department);
    onBroadcast(script, isEmergency);
    setPreviewScript(script);
  };

  const isEmergencyCategory = category === 'emergency';

  return (
    <div className="space-y-6">
      {/* Announcement Input */}
      <div className="space-y-3">
        <Label htmlFor="announcement" className="text-foreground font-display font-semibold flex items-center gap-2">
          <Mic className="w-4 h-4 text-primary" />
          Announcement Content
        </Label>
        <Textarea
          id="announcement"
          placeholder="Enter your announcement here... (e.g., 'All students are requested to assemble in the main auditorium at 11 AM for the cultural event.')"
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          className="min-h-[120px] bg-secondary border-border focus:border-primary focus:ring-primary/20 resize-none text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Category & Department Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground font-display font-semibold">Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as AnnouncementCategory)}>
            <SelectTrigger className="bg-secondary border-border focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {categories.map((cat) => (
                <SelectItem 
                  key={cat.value} 
                  value={cat.value}
                  className={cn(
                    "focus:bg-secondary",
                    cat.value === 'emergency' && "text-emergency"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{cat.label}</span>
                    <span className="text-xs text-muted-foreground">{cat.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-display font-semibold">Department</Label>
          <Select 
            value={department} 
            onValueChange={(v) => setDepartment(v as Department)}
            disabled={category !== 'department'}
          >
            <SelectTrigger className={cn(
              "bg-secondary border-border focus:border-primary",
              category !== 'department' && "opacity-50"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept} className="focus:bg-secondary">
                  {dept === 'ALL' ? 'All Departments' : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Preview Section */}
      {previewScript && (
        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-display font-semibold text-primary">RJ Script Preview</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed italic">
            "{previewScript}"
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={handlePreview}
          disabled={!announcement.trim()}
          className="flex-1 border-border hover:bg-secondary hover:border-primary"
        >
          <Volume2 className="w-4 h-4 mr-2" />
          Preview Script
        </Button>

        <Button
          onClick={() => handleBroadcast(false)}
          disabled={!announcement.trim() || (!canBroadcast && !isEmergencyCategory) || isPlaying}
          className={cn(
            "flex-1 radio-gradient text-primary-foreground font-semibold glow-primary",
            (!canBroadcast && !isEmergencyCategory) && "opacity-50"
          )}
        >
          <Radio className="w-4 h-4 mr-2" />
          Broadcast Announcement
        </Button>

        <Button
          onClick={() => handleBroadcast(true)}
          disabled={!announcement.trim() || isPlaying}
          className="flex-1 emergency-gradient text-white font-semibold glow-emergency"
        >
          <AlertOctagon className="w-4 h-4 mr-2" />
          Emergency Broadcast
        </Button>
      </div>

      {!canBroadcast && (
        <p className="text-sm text-muted-foreground text-center">
          ⏰ Normal broadcasts are only available during break times. Use Emergency Broadcast for urgent announcements.
        </p>
      )}
    </div>
  );
};
