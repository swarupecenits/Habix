import { useState } from 'react';
import { Alert, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useHabitStore } from '../../store/useHabitStore';

export default function Settings() {
  const [reminders, setReminders] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const [droughtMode, setDroughtMode] = useState(false);

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
      
      {/* Aesthetic Background Gradient Orbs */}
      <View className="absolute top-[-100] right-[-100] w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] opacity-40" />
      <View className="absolute top-[40%] left-[-50] w-72 h-72 bg-emerald-900/10 rounded-full blur-[80px] opacity-40" />

      {/* Header */}
      <View className="px-6 pt-20 pb-2 z-10 bg-transparent">
        <Text className="text-3xl font-bold text-white tracking-tight">Profile</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        
        {/* User Profile Card */}
        <View className="bg-zinc-900/60 border border-zinc-800 rounded-[32px] p-6 mb-8 items-center relative overflow-hidden">
          <View className="absolute top-0 left-0 right-0 h-24 bg-emerald-900/20" />
          <View className="w-24 h-24 bg-black border-4 border-[#09090b] rounded-full items-center justify-center mb-4 mt-4 shadow-xl">
            <Text className="text-4xl">🧑‍🌾</Text>
          </View>
          <Text className="text-2xl font-extrabold text-white tracking-tight">Swarup</Text>
          <Text className="text-emerald-400 font-bold tracking-widest text-[11px] uppercase mt-2 bg-emerald-900/30 px-3 py-1 rounded-full">
            Master Botanist
          </Text>
          
          <View className="flex-row mt-6 w-full justify-around border-t border-zinc-800 pt-4">
            <View className="items-center">
              <Text className="text-white font-bold text-lg">14</Text>
              <Text className="text-zinc-500 text-xs">Days Inside</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-lg">3</Text>
              <Text className="text-zinc-500 text-xs">Rare Seeds</Text>
            </View>
          </View>
        </View>

        {/* Unique Ecology Features */}
        <Text className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-3 ml-2">Unique Ecology</Text>
        {renderSettingToggle('🧘', 'Zen Mode', 'Hide numerical streaks to reduce anxiety. Focus only on the plant.', zenMode, setZenMode)}
        {renderSettingToggle('🏜️', 'Drought Mode', 'Hardcore: Miss a day, and your plant loses 2 stages instead of 1.', droughtMode, setDroughtMode)}

        {/* Standard Preferences */}
        <Text className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-3 ml-2 mt-6">Preferences</Text>
        {renderSettingToggle('🔔', 'Daily Reminders', 'Gentle nudges to water your garden.', reminders, setReminders)}
        {renderSettingToggle('📳', 'Haptic Feedback', 'Feel the roots grow when you complete a habit.', haptics, setHaptics)}
        
        {/* Data & Danger Zone */}
        <Text className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-3 ml-2 mt-6">Data</Text>
        <TouchableOpacity 
          className="flex-row items-center bg-zinc-900/60 border border-zinc-800 rounded-[24px] p-4 mb-3"
        >
          <View className="w-12 h-12 bg-blue-900/20 rounded-2xl items-center justify-center mr-4">
            <Text className="text-xl">☁️</Text>
          </View>
          <Text className="text-white text-base font-semibold tracking-tight">Backup Garden to Cloud</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleReset}
          className="flex-row items-center bg-red-950/20 border border-red-900/30 rounded-[24px] p-4 mb-8 mt-2"
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