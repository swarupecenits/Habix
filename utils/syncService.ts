import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { Habit } from '../types/habit';
import { supabase } from './supabase';

export const backupHabitsToCloud = async (habits: Habit[], userId: string) => {
  // 1. Fetch existing cloud habits for this user
  const { data: existingCloudHabits, error: fetchError } = await supabase
    .from('habits')
    .select('id, title, streak, "completedDates"')
    .eq('user_id', userId);

  if (fetchError) throw fetchError;

  // 2. Prepare payload, preventing duplicates by matching titles
  const payload = habits.map(localHabit => {
    // Look for a cloud habit with the exact same title (case-insensitive)
    const matchingCloudHabit = existingCloudHabits?.find(
      ch => ch.title.trim().toLowerCase() === localHabit.title.trim().toLowerCase()
    );

    // Merge completed dates to prevent data loss 
    let mergedDates = localHabit.completedDates || [];
    if (matchingCloudHabit && matchingCloudHabit.completedDates) {
      mergedDates = Array.from(new Set([...mergedDates, ...matchingCloudHabit.completedDates]));
    }

    return {
      // If a matching cloud habit exists, FORCE use its ID to overwrite instead of creating a new duplicate
      id: matchingCloudHabit ? matchingCloudHabit.id : localHabit.id,
      user_id: userId,
      title: localHabit.title,
      streak: Math.max(localHabit.streak, matchingCloudHabit?.streak || 0),
      completedDates: mergedDates,
      plantStage: localHabit.plantStage,
      growthScore: localHabit.growthScore,
    };
  });

  const { data, error } = await supabase
    .from('habits')
    .upsert(payload, { onConflict: 'id' });

  if (error) throw error;
  return data;
};

export const restoreHabitsFromCloud = async (userId: string): Promise<Habit[]> => {
  const { data, error } = await supabase
    .from('habits')
    .select('id, title, streak, "completedDates", "plantStage", "growthScore"')
    .eq('user_id', userId);

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    title: item.title,
    streak: item.streak,
    completedDates: item.completedDates || [],
    plantStage: item.plantStage,
    growthScore: item.growthScore,
  })) as Habit[];
};

export const uploadAvatarToCloud = async (userId: string, uri: string): Promise<string> => {
  // Read local file as base64 to avoid fetch().blob() React Native network issues
  const base64Info = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });

  const arrayBuffer = decode(base64Info);
  
  // Use a timestamp to prevent browser caching issues when replacing an avatar
  const filename = `${userId}/${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filename, arrayBuffer, { 
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) throw error;
  
  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filename);
    
  return publicUrlData.publicUrl;
};

export const saveProfileToCloud = async (userId: string, name: string, avatarUrl: string | null) => {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, name, avatar_url: avatarUrl }, { onConflict: 'id' });

  if (error) throw error;
};

export const restoreProfileFromCloud = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, avatar_url')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
     // Throw any error EXCEPT the "No rows found" error
     throw error;
  }
  
  return data;
};