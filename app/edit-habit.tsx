import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { useHabitStore } from '../store/useHabitStore';
import { useProfileStore } from '../store/useProfileStore';
import { FloraType } from '../types/habit';

const FLORA_TYPES: { id: FloraType; label: string; icon: string; desc: string }[] = [
  { id: 'oak', label: 'Oak Tree', icon: '🌳', desc: 'Fitness & Health: Harder to grow, sturdy, survives missed days.' },
  { id: 'bamboo', label: 'Bamboo', icon: '🎋', desc: 'Mindfulness: Fast growing, needs daily watering.' },
  { id: 'vine', label: 'Fruiting Vine', icon: '🍇', desc: 'Diet & Water: Moderate pace, bears fruit.' },
];

export default function EditHabit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const habits = useHabitStore((state) => state.habits);
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const hapticsEnabled = useProfileStore((state) => state.hapticsEnabled);
  
  const existingHabit = habits.find((h) => h.id === id);

  const [title, setTitle] = useState(existingHabit?.title || '');
  const [floraType, setFloraType] = useState<FloraType>(existingHabit?.floraType || 'oak');

  useEffect(() => {
    if (!existingHabit) {
      router.back();
    }
  }, [existingHabit]);

  const handleSave = () => {
    if (!title.trim() || !existingHabit) {
      if (hapticsEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }
    
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    updateHabit(existingHabit.id, {
      title,
      floraType
    });
    
    router.back();
  };

  if (!existingHabit) return <View className="flex-1 bg-black" />;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 bg-black p-6 pt-16" 
      style={{ backgroundColor: COLORS.background }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-extrabold text-white">Edit Seed ✂️</Text>
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-zinc-800 rounded-full">
          <X color="white" size={24} />
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-medium text-slate-400 mb-2">Habit Name</Text>
      <TextInput
        className="w-full text-2xl font-bold bg-zinc-900 border-2 border-zinc-800 text-white rounded-2xl px-6 py-5 mb-6 focus:border-green-500"
        placeholder="e.g. Read 10 pages"
        placeholderTextColor="#52525B"
        value={title}
        onChangeText={setTitle}
        autoFocus
      />

      <Text className="text-lg font-medium text-slate-400 mb-2 mt-4">Select Seed Type</Text>
      <View className="space-y-3 mb-6">
        {FLORA_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => setFloraType(type.id)}
            className={`p-4 rounded-2xl border-2 flex-row items-center ${floraType === type.id ? 'border-green-500 bg-green-500/10' : 'border-zinc-800 bg-zinc-900'}`}
          >
            <Text className="text-3xl mr-4">{type.icon}</Text>
            <View className="flex-1">
              <Text className={`text-lg font-bold ${floraType === type.id ? 'text-green-500' : 'text-white'}`}>{type.label}</Text>
              <Text className="text-sm text-slate-400 mt-1">{type.desc}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        className={`w-full py-5 rounded-2xl items-center mt-6 mb-8 shadow-xl ${title.trim() ? 'bg-green-500' : 'bg-green-500/50'}`}
        disabled={!title.trim()}
        onPress={handleSave}
      >
        <Text className="text-2xl font-bold text-black">Update {floraType === 'oak' ? 'Oak' : floraType === 'bamboo' ? 'Bamboo' : 'Vine'}</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}