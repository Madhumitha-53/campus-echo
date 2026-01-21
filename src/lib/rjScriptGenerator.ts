export type AnnouncementCategory = 'general' | 'department' | 'event' | 'emergency';

export type Department = 'CSE' | 'AI&DS' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'IT' | 'MBA' | 'ALL';

const greetings = [
  "Good morning students",
  "Hello everyone",
  "Hey there campus family",
  "Greetings students",
  "Hi everyone",
];

const openings = [
  "you're listening to Campus FM, the official voice of our college",
  "this is Campus FM, bringing you all the latest updates from around campus",
  "Campus FM here, your one-stop destination for all campus announcements",
  "you've tuned into Campus FM, keeping you connected with campus life",
];

const transitions = [
  "Here's an important update for you",
  "We have some news to share",
  "Pay attention to this announcement",
  "Here's what you need to know",
  "Listen up, we have something important",
];

const closings = [
  "That's all for now. Stay tuned to Campus FM for more updates. Have a great day ahead!",
  "Thank you for listening. Keep it locked to Campus FM. See you next time!",
  "That's the update for now. This is Campus FM, signing off. Take care everyone!",
  "And that's a wrap. Stay connected with Campus FM. Catch you later!",
  "Remember, Campus FM is always here for you. Until next time, stay awesome!",
];

const emergencyOpenings = [
  "Attention please! This is an urgent announcement from Campus FM.",
  "Important notice! All students please listen carefully.",
  "Emergency broadcast! This requires your immediate attention.",
];

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning students";
  if (hour < 17) return "Good afternoon students";
  return "Good evening students";
};

const getDepartmentIntro = (department: Department): string => {
  if (department === 'ALL') {
    return "This announcement is for all departments.";
  }
  return `This announcement is specifically for the ${department} department students.`;
};

const getCategoryIntro = (category: AnnouncementCategory): string => {
  switch (category) {
    case 'event':
      return "We have an exciting event coming up!";
    case 'department':
      return "Here's a departmental update.";
    case 'emergency':
      return "";
    default:
      return "";
  }
};

export const generateRJScript = (
  announcement: string,
  category: AnnouncementCategory,
  department: Department = 'ALL'
): string => {
  if (category === 'emergency') {
    const emergencyOpening = getRandomItem(emergencyOpenings);
    return `${emergencyOpening} ${announcement}. I repeat, ${announcement}. Please follow all safety protocols. This is Campus FM with an emergency broadcast.`;
  }

  const greeting = getTimeBasedGreeting();
  const opening = getRandomItem(openings);
  const transition = getRandomItem(transitions);
  const categoryIntro = getCategoryIntro(category);
  const departmentIntro = category === 'department' ? getDepartmentIntro(department) : '';
  const closing = getRandomItem(closings);

  let script = `${greeting}, ${opening}. `;
  
  if (categoryIntro) {
    script += `${categoryIntro} `;
  }
  
  if (departmentIntro) {
    script += `${departmentIntro} `;
  }
  
  script += `${transition}. ${announcement}. ${closing}`;

  return script;
};

export const departments: Department[] = ['ALL', 'CSE', 'AI&DS', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'MBA'];

export const categories: { value: AnnouncementCategory; label: string; description: string }[] = [
  { value: 'general', label: 'General', description: 'Campus-wide announcements' },
  { value: 'department', label: 'Department', description: 'Department-specific updates' },
  { value: 'event', label: 'Event', description: 'Upcoming events and activities' },
  { value: 'emergency', label: 'Emergency', description: 'Urgent announcements' },
];
