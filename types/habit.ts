export type PlantStage = 0 | 1 | 2 | 3 | 4;

export type Habit = {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
  streak: number;
  longestStreak: number;
  plantStage: PlantStage; // 0 = Seed, 1 = Sprout, 2 = Small plant, 3 = Growing plant, 4 = Full bloom
  growthScore: number;
  color: string;
};
