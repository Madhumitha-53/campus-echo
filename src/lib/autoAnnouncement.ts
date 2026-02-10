import { BreakTime, isBreakTime } from "./breakTimeConfig";
import { generateRJScript } from "./rjScriptGenerator";
import { ttsService } from "./textToSpeech";

export interface QueuedAnnouncement {
  id: string;
  text: string;
  category: 'general' | 'department' | 'event';
  department: string;
  addedAt: number;
}

const STORAGE_KEY = "campusfm_auto_queue";

export const getQueuedAnnouncements = (): QueuedAnnouncement[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addToQueue = (announcement: QueuedAnnouncement): void => {
  const queue = getQueuedAnnouncements();
  queue.push(announcement);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

export const removeFromQueue = (id: string): void => {
  const queue = getQueuedAnnouncements().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

export const clearQueue = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};

// Tracks which break we already auto-played in to avoid repeats
let lastAutoPlayedBreakId: string | null = null;

export const checkAndAutoPlay = (
  breakTimes: BreakTime[],
  onStart: (script: string) => void,
  onEnd: () => void
): boolean => {
  const { isBreak, currentBreak } = isBreakTime(breakTimes);
  
  if (!isBreak || !currentBreak) {
    lastAutoPlayedBreakId = null; // Reset when not in break
    return false;
  }

  // Don't auto-play again in the same break
  if (lastAutoPlayedBreakId === currentBreak.id) {
    return false;
  }

  const queue = getQueuedAnnouncements();
  if (queue.length === 0) return false;

  lastAutoPlayedBreakId = currentBreak.id;

  // Build combined script from all queued announcements
  const scripts = queue.map(a => 
    generateRJScript(a.text, a.category, a.department as any)
  );
  const combinedScript = scripts.join(" ... And now, the next announcement. ... ");

  onStart(combinedScript);

  ttsService.speak(
    combinedScript,
    { rate: 0.9, volume: 1 },
    () => {},
    () => {
      clearQueue();
      onEnd();
    },
    () => onEnd()
  );

  return true;
};
