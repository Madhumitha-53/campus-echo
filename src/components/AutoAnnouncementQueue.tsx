import { useState, useEffect } from "react";
import { Clock, Plus, Trash2, List, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  QueuedAnnouncement,
  getQueuedAnnouncements,
  addToQueue,
  removeFromQueue,
} from "@/lib/autoAnnouncement";
import { categories, departments, Department, AnnouncementCategory } from "@/lib/rjScriptGenerator";
import { cn } from "@/lib/utils";

interface AutoAnnouncementQueueProps {
  isPlaying: boolean;
}

export const AutoAnnouncementQueue = ({ isPlaying }: AutoAnnouncementQueueProps) => {
  const [queue, setQueue] = useState<QueuedAnnouncement[]>([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("general");
  const [department, setDepartment] = useState<Department>("ALL");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQueue(getQueuedAnnouncements());
  }, [open]);

  const handleAdd = () => {
    if (!text.trim()) return;
    const item: QueuedAnnouncement = {
      id: `${Date.now()}`,
      text: text.trim(),
      category: category === "emergency" ? "general" : category,
      department,
      addedAt: Date.now(),
    };
    addToQueue(item);
    setQueue(getQueuedAnnouncements());
    setText("");
  };

  const handleRemove = (id: string) => {
    removeFromQueue(id);
    setQueue(getQueuedAnnouncements());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-border hover:bg-secondary hover:border-primary relative"
        >
          <Clock className="w-4 h-4 mr-2" />
          Auto Queue
          {queue.length > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center radio-gradient text-primary-foreground text-xs">
              {queue.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Auto-Broadcast Queue
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Queued announcements play automatically when the next break starts.
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Add new */}
          <div className="space-y-3">
            <Textarea
              placeholder="Type announcement to queue..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[80px] bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
            <div className="grid grid-cols-2 gap-2">
              <Select value={category} onValueChange={(v) => setCategory(v as AnnouncementCategory)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.filter(c => c.value !== "emergency").map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
                <SelectTrigger className={cn("bg-secondary border-border", category !== "department" && "opacity-50")} disabled={category !== "department"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d === "ALL" ? "All Depts" : d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleAdd}
              disabled={!text.trim() || isPlaying}
              className="w-full radio-gradient text-primary-foreground font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Queue
            </Button>
          </div>

          {/* Queue list */}
          {queue.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <List className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No announcements queued</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                {queue.length} queued
              </p>
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{item.category}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                    className="shrink-0 text-muted-foreground hover:text-emergency"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
