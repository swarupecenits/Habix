import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { FloraType, Habit } from '../types/habit';
import { calculateGrowthScore, calculateStreak, getPlantStage } from '../utils/habitUtils';

type HabitStore = {
  habits: Habit[];
  addHabit: (title: string, category: string, color: string, floraType: FloraType) => void;
  toggleHabitCompletion: (id: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  devGrowPlant: (id: string) => void;
};

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      addHabit: (title, category, color, floraType) => {
        const newHabit: Habit = {
          id: Math.random().toString(36).substring(7),
          title,
          category,
          floraType,
          createdAt: new Date().toISOString(),
          completedDates: [],
          streak: 0,
          longestStreak: 0,
          plantStage: 0,
          growthScore: 0,
          color,
        };
        set({ habits: [...get().habits, newHabit] });
      },
      toggleHabitCompletion: (id, dateStr) => {
        set((state) => {
          const habits = state.habits.map((habit) => {
            if (habit.id === id) {
              const isCompleted = habit.completedDates.includes(dateStr);
              let newDates = isCompleted 
                ? habit.completedDates.filter((d) => d !== dateStr)
                : [...habit.completedDates, dateStr].sort().reverse();
              
              const newStreak = calculateStreak(newDates);
              const longestStreak = Math.max(habit.longestStreak, newStreak);
              const fType = habit.floraType || 'oak';
              const plantStage = getPlantStage(newStreak, fType);
              const growthScore = calculateGrowthScore(newStreak, fType);

              return {
                ...habit,
                completedDates: newDates,
                streak: newStreak,
                longestStreak,
                plantStage,
                growthScore,
              };
            }
            return habit;
          });
          return { habits };
        });
      },
      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        }));
      },
      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
      },
      devGrowPlant: (id) => {
        set((state) => {
          const habits = state.habits.map((habit) => {
            if (habit.id === id) {
              const newStreak = habit.streak + 1;
              const newDates = [];
              for (let i = 0; i < newStreak; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                newDates.push(`${year}-${month}-${day}`);
              }
              const fType = habit.floraType || 'oak';
              return {
                ...habit,
                completedDates: newDates,
                streak: newStreak,
                longestStreak: Math.max(habit.longestStreak, newStreak),
                plantStage: getPlantStage(newStreak, fType),
                growthScore: calculateGrowthScore(newStreak, fType),
              };
            }
            return habit;
          });
          return { habits };
        });
      },
    }),
    {
      name: 'habix-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);