import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback } from 'react-native';
import AuthModal from '../../components/AuthModal';
import EditProfileModal from '../../components/EditProfileModal';
import { useAuthStore } from '../../store/useAuthStore';
import { useHabitStore } from '../../store/useHabitStore';
import { useProfileStore } from '../../store/useProfileStore';
import { cancelAllReminders, registerForLocalNotificationsAsync, scheduleDailyReminder } from '../../utils/notifications';
import { supabase } from '../../utils/supabase';
import { backupHabitsToCloud, restoreHabitsFromCloud } from '../../utils/syncService';

export default function Settings() {
  const [zenMode, setZenMode] = useState(false);
  const [droughtMode, setDroughtMode] = useState(false);

  const { habits } = useHabitStore();
  const { session, user } = useAuthStore();
  const { name, avatarUri, hapticsEnabled, remindersEnabled, reminderTime, updateProfile } = useProfileStore();
  
  const [authVisible, setAuthVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [fullScreenAvatarVisible, setFullScreenAvatarVisible] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleReminderToggle = async (enabled: boolean) => {
    if (enabled) {
      const perms = await registerForLocalNotificationsAsync();
      if (!perms) {
        Alert.alert("Permission Denied", "Please enable notifications in your phone's settings.");
        return;
      }
      setShowTimePicker(true);
    } else {
      updateProfile({ remindersEnabled: false });
      cancelAllReminders();
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedDate) {
      const isoResponse = selectedDate.toISOString();
      updateProfile({ reminderTime: isoResponse, remindersEnabled: true });
      scheduleDailyReminder(isoResponse);
    }
  };

  const formattedTime = reminderTime 
    ? new Date(reminderTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : '';

  const reminderDescription = remindersEnabled && formattedTime 
    ? `Reminding you daily at ${formattedTime}.` 
    : 'Gentle nudges to water your garden.';

  const handleReset = () => {
    Alert.alert(
      "Burn the Garden?",
      "This will delete all your habits and uproot your entire garden. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Burn it down", style: "destructive", onPress: () => useHabitStore.setState({ habits: [] }) }
      ]
    );
  };

  const handleCloudBackup = async () => {
    if (!user) {
      setAuthVisible(true);
      return;
    }
    if (habits.length === 0) {
      Alert.alert('Empty Garden', 'You have no habits to backup!');
      return;
    }
    try {
      setSyncing(true);
      await backupHabitsToCloud(habits, user.id);
      Alert.alert('Success', 'Your garden is safely blooming in the cloud! ☁️🌸');
    } catch (e: any) {
      Alert.alert('Backup Failed', e.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleCloudRestore = async () => {
    if (!user) return;
    try {
      setSyncing(true);
      const cloudHabits = await restoreHabitsFromCloud(user.id);
      if (cloudHabits.length > 0) {
        useHabitStore.setState({ habits: cloudHabits });
      }

      try {
        const cloudProfile = await restoreProfileFromCloud(user.id);
        if (cloudProfile) {
          useProfileStore.setState({ 
            name: cloudProfile.name || 'Gardener', 
            avatarUri: cloudProfile.avatar_url || null 
          });
        }
      } catch (profileErr) {
        console.log("No profile found to restore or profile restore failed:", profileErr);
      }

      Alert.alert('Success', 'Your garden and profile have been restored from the cloud! 🌱💦');
    } catch (e: any) {
      Alert.alert('Restore Failed', e.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderSettingToggle = (icon: string, title: string, description: string, value: boolean, onValueChange: (v: boolean) => void) => (
    <View className="flex-row items-center justify-between bg-zinc-900/60 border border-zinc-800 rounded-[24px] p-4 mb-3">
      <View className="flex-row items-center flex-1 pr-4">
        <View className="w-12 h-12 bg-zinc-800/50 rounded-2xl items-center justify-center mr-4">
          <Text className="text-xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white text-base font-semibold tracking-tight">{title}</Text>
          <Text className="text-zinc-500 text-[12px] mt-0.5 leading-snug">{description}</Text>
        </View>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: '#27272a', true: '#059669' }}
        thumbColor={value ? '#ffffff' : '#a1a1aa'}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-[#09090b] justify-start relative">
      <StatusBar barStyle="light-content" />
      <AuthModal visible={authVisible} onClose={() => setAuthVisible(false)} />
      <EditProfileModal visible={editProfileVisible} onClose={() => setEditProfileVisible(false)} />
      
      {/* Full Screen Avatar Modal */}
      <Modal visible={fullScreenAvatarVisible} transparent={true} animationType="fade">
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }} 
          activeOpacity={1} 
          onPress={() => setFullScreenAvatarVisible(false)}
        >
          {avatarUri && (
            <Image 
              source={{ uri: avatarUri }} 
              style={{ width: '90%', height: '90%', resizeMode: 'contain' }} 
            />
          )}
        </TouchableOpacity>
      </Modal>

      {/* Aesthetic Background Gradient Orbs */}
      <View className="absolute top-[-100] right-[-100] w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] opacity-40" />
      <View className="absolute top-[40%] left-[-50] w-72 h-72 bg-emerald-900/10 rounded-full blur-[80px] opacity-40" />

      {/* Header */}
      <View className="px-6 pt-20 pb-2 z-10 bg-transparent flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-white tracking-tight">Profile</Text>
        <View className="flex-row">
          <TouchableOpacity onPress={() => setEditProfileVisible(true)} className="bg-zinc-800/80 px-3 py-2 border border-zinc-700/50 rounded-full mr-2">
            <Text className="text-zinc-300 font-bold text-xs uppercase tracking-wider">Edit</Text>
          </TouchableOpacity>
          {user && (
            <TouchableOpacity onPress={handleLogout} className="bg-red-500/10 px-4 py-2 border border-red-500/20 rounded-full">
              <Text className="text-red-400 font-bold text-xs uppercase tracking-wider">Log out</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        
        {/* User Profile Card */}
        <View className="bg-zinc-900/60 border border-zinc-800 rounded-[32px] p-6 mb-8 items-center relative overflow-hidden">
          <View className="absolute top-0 left-0 right-0 h-24 bg-emerald-900/20" />
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => { if (avatarUri) setFullScreenAvatarVisible(true); }}
            className="w-24 h-24 bg-black border-4 border-[#09090b] rounded-full items-center justify-center mb-4 mt-4 shadow-xl overflow-hidden"
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} className="w-full h-full" />
            ) : (
              <Text className="text-4xl">{user ? '🦸🏽‍♂️' : '🧑‍🌾'}</Text>
            )}
          </TouchableOpacity>
          <Text className="text-2xl font-extrabold text-white tracking-tight">
            {name || (user ? user.email?.split('@')[0] : 'Guest Gardener')}
          </Text>
          <Text className="text-emerald-400 font-bold tracking-widest text-[11px] uppercase mt-2 bg-emerald-900/30 px-3 py-1 rounded-full">
            {user ? 'Cloud Sync Active' : 'Offline Mode'}
          </Text>
          
          <View className="flex-row mt-6 w-full justify-around border-t border-zinc-800 pt-4">
            <View className="items-center">
              <Text className="text-white font-bold text-lg">{habits.length}</Text>
              <Text className="text-zinc-500 text-xs">Total Habits</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-lg">{habits.reduce((acc, h) => acc + h.streak, 0)}</Text>
              <Text className="text-zinc-500 text-xs">Total Petals</Text>
            </View>
          </View>
        </View>

        {/* Unique Ecology Features */}
        <Text className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-3 ml-2">Unique Ecology</Text>
        {renderSettingToggle('🧘', 'Zen Mode', 'Hide numerical streaks to reduce anxiety. Focus only on the plant.', zenMode, setZenMode)}
        {renderSettingToggle('🏜️', 'Drought Mode', 'Hardcore: Miss a day, and your plant loses 2 stages instead of 1.', droughtMode, setDroughtMode)}

        {/* Standard Preferences */}
        <Text className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-3 ml-2 mt-6">Preferences</Text>
        {renderSettingToggle('🔔', 'Daily Reminders', reminderDescription, remindersEnabled, handleReminderToggle)}

        {showTimePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={reminderTime ? new Date(reminderTime) : new Date(new Date().setHours(8, 0, 0, 0))}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleTimeChange}
          />
        )}

        {renderSettingToggle('📳', 'Haptic Feedback', 'Feel the roots grow and respond to your touch.', hapticsEnabled, (v) => updateProfile({ hapticsEnabled: v }))}
        
        {/* Data & Cloud Backup Zone */}
        <Text className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-3 ml-2 mt-6">Cloud & Data</Text>
        
        <TouchableOpacity 
          onPress={handleCloudBackup}
          disabled={syncing}
          className="flex-row items-center bg-blue-950/30 border border-blue-900/40 rounded-[24px] p-4 mb-3 relative overflow-hidden"
        >
          <View className="w-12 h-12 bg-blue-900/40 rounded-2xl items-center justify-center mr-4 z-10">
            <Text className="text-xl">☁️</Text>
          </View>
          <View className="flex-1 z-10">
            <Text className="text-blue-400 text-base font-semibold tracking-tight">
              {user ? 'Backup Garden to Cloud' : 'Sign in to Backup'}
            </Text>
            <Text className="text-blue-400/60 text-[12px] mt-0.5">Secure your habits online</Text>
          </View>
          {syncing && <ActivityIndicator color="#60a5fa" className="z-10" />}
        </TouchableOpacity>

        {user && (
          <TouchableOpacity 
            onPress={handleCloudRestore}
            disabled={syncing}
            className="flex-row items-center bg-emerald-950/30 border border-emerald-900/40 rounded-[24px] p-4 mb-3 relative overflow-hidden"
          >
            <View className="w-12 h-12 bg-emerald-900/40 rounded-2xl items-center justify-center mr-4 z-10">
              <Text className="text-xl">🌱</Text>
            </View>
            <View className="flex-1 z-10">
              <Text className="text-emerald-400 text-base font-semibold tracking-tight">Restore from Cloud</Text>
              <Text className="text-emerald-400/60 text-[12px] mt-0.5">Sync habits & profile across devices</Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          onPress={handleReset}
          className="flex-row items-center bg-red-950/20 border border-red-900/30 rounded-[24px] p-4 mb-8 mt-8"
        >
          <View className="w-12 h-12 bg-red-900/40 rounded-2xl items-center justify-center mr-4">
            <Text className="text-xl">🔥</Text>
          </View>
          <View className="flex-1">
            <Text className="text-red-500 text-base font-semibold tracking-tight">Burn Garden</Text>
            <Text className="text-red-500/50 text-[12px] mt-0.5">Permenantly reset all habits</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}