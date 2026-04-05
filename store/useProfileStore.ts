import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ProfileState {
  name: string;
  avatarUri: string | null;
  hapticsEnabled: boolean;
  remindersEnabled: boolean;
  reminderTime: string | null; // ISO format string to save easily
  updateProfile: (updates: Partial<Omit<ProfileState, 'updateProfile'>>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: 'Gardener',
      avatarUri: null,
      hapticsEnabled: true,
      remindersEnabled: false,
      reminderTime: null,
      updateProfile: (updates) => set((state) => ({ ...state, ...updates })),
    }),
    {
      name: 'habix-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
