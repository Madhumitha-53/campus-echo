export interface BreakTime {
  id: string;
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  enabled: boolean;
}

export const defaultBreakTimes: BreakTime[] = [
  {
    id: 'morning',
    name: 'Morning Break',
    startHour: 10,
    startMinute: 30,
    endHour: 10,
    endMinute: 45,
    enabled: true,
  },
  {
    id: 'lunch',
    name: 'Lunch Break',
    startHour: 12,
    startMinute: 30,
    endHour: 13,
    endMinute: 30,
    enabled: true,
  },
  {
    id: 'afternoon',
    name: 'Afternoon Break',
    startHour: 15,
    startMinute: 0,
    endHour: 15,
    endMinute: 15,
    enabled: true,
  },
  {
    id: 'evening',
    name: 'Evening Break',
    startHour: 17,
    startMinute: 0,
    endHour: 17,
    endMinute: 30,
    enabled: true,
  },
];

export const isBreakTime = (breakTimes: BreakTime[]): { isBreak: boolean; currentBreak: BreakTime | null } => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  for (const breakTime of breakTimes) {
    if (!breakTime.enabled) continue;
    
    const startTimeInMinutes = breakTime.startHour * 60 + breakTime.startMinute;
    const endTimeInMinutes = breakTime.endHour * 60 + breakTime.endMinute;

    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
      return { isBreak: true, currentBreak: breakTime };
    }
  }

  return { isBreak: false, currentBreak: null };
};

export const getNextBreakTime = (breakTimes: BreakTime[]): BreakTime | null => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const enabledBreaks = breakTimes.filter(b => b.enabled);
  
  for (const breakTime of enabledBreaks) {
    const startTimeInMinutes = breakTime.startHour * 60 + breakTime.startMinute;
    if (startTimeInMinutes > currentTimeInMinutes) {
      return breakTime;
    }
  }

  return enabledBreaks[0] || null;
};

export const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
};
