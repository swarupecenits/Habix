import { FloraType, PlantStage } from '../types/habit';

export const getTodayStr = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Extremely robust Date parser that prevents UTC Midnight timezone calculation bugs
const parseDateString = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0); 
};

export const calculateLongestStreak = (completedDates: string[]): number => {
  if (!completedDates || completedDates.length === 0) return 0;
  
  // Sort dates oldest to newest
  const sorted = [...completedDates].sort((a, b) => parseDateString(a).getTime() - parseDateString(b).getTime());
  
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = parseDateString(sorted[i - 1]);
    const currDate = parseDateString(sorted[i]);
    
    // Check difference in days
    const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
    
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
  }
  
  return maxStreak;
};

export const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort((a, b) => parseDateString(b).getTime() - parseDateString(a).getTime());
  const today = getTodayStr();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  
  const yYear = yesterdayDate.getFullYear();
  const yMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterdayDate.getDate()).padStart(2, '0');
  const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

  if (sortedDates[0] !== today && sortedDates[0] !== yesterdayStr) {
    return 0; // Streak broken
  }

  let streak = 0;
  let currentDate = parseDateString(sortedDates[0]);

  for (let i = 0; i < sortedDates.length; i++) {
    const dStr = sortedDates[i];
    const cYear = currentDate.getFullYear();
    const cMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const cDay = String(currentDate.getDate()).padStart(2, '0');
    const expectedStr = `${cYear}-${cMonth}-${cDay}`;

    if (dStr === expectedStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getPlantStage = (streak: number, type: FloraType = 'oak'): PlantStage => {
  if (type === 'oak') {
    // Oak grows slow but is majestic
    if (streak <= 2) return 0;
    if (streak <= 7) return 1;
    if (streak <= 15) return 2;
    if (streak <= 30) return 3;
    return 4;
  } else if (type === 'bamboo') {
    // Bamboo springs up quickly
    if (streak <= 1) return 0;
    if (streak <= 3) return 1;
    if (streak <= 7) return 2;
    if (streak <= 14) return 3;
    return 4;
  } else {
    // Vine: moderate pace with fruiting progression
    if (streak <= 2) return 0;
    if (streak <= 5) return 1;
    if (streak <= 12) return 2;
    if (streak <= 21) return 3;
    return 4;
  }
};

export const calculateGrowthScore = (streak: number, type: FloraType = 'oak'): number => {
  const maxStreak = type === 'oak' ? 30 : type === 'bamboo' ? 14 : 21;
  return Math.min(100, Math.floor((streak / maxStreak) * 100)); 
};