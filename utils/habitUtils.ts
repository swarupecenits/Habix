import { PlantStage } from '../types/habit';

export const getTodayStr = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;
  
  const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
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
  let currentDate = new Date(sortedDates[0]);

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

export const getPlantStage = (streak: number): PlantStage => {
  if (streak <= 2) return 0; // Seed
  if (streak <= 6) return 1; // Sprout
  if (streak <= 13) return 2; // Small plant
  if (streak <= 20) return 3; // Growing plant
  return 4; // Full bloom
};

export const calculateGrowthScore = (streak: number): number => {
  return Math.min(100, Math.floor((streak / 21) * 100)); 
};