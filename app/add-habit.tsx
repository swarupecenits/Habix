import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';
import { useHabitStore } from '../store/useHabitStore';

export default function AddHabit() {
  const router = useRouter();
  const addHabit = useHabitStore((state) => state.addHabit);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('mindfulness');

  const handleSave = () => {
    if (!title.trim()) return;
    addHabit(title, category, COLORS.accent);
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      className="flex-1 bg-black p-6 pt-16" 
      style={{ backgroundColor: COLORS.background }}
    >
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-extrabold text-white">New Seed 🌱</Text>
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

      <TouchableOpacity 
        className={`w-full py-5 rounded-2xl items-center mt-auto mb-8 shadow-xl ${title.trim() ? 'bg-green-500' : 'bg-green-500/50'}`}
        disabled={!title.trim()}
        onPress={handleSave}
      >
        <Text className="text-2xl font-bold text-black">Plant Seed</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}