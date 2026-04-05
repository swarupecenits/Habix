import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { Habit } from '../types/habit';
import { supabase } from './supabase';

export const backupHabitsToCloud = async (habits: Habit[], userId: string) => {
  const payload = habits.map(h => ({
    id: h.id,
    user_id: userId,
    title: h.title,
    streak: h.streak,
    completedDates: h.completedDates,
    plantStage: h.plantStage,
    growthScore: h.growthScore,
  }));

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