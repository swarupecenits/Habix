import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import PlantVisual from '../../components/PlantVisual';
import { useHabitStore } from '../../store/useHabitStore';

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const habit = useHabitStore((state) => state.habits.find((h) => h.id === id));
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  if (!habit) return <View className="flex-1 bg-black" />;

  const handleDelete = () => {
    deleteHabit(habit.id);
    router.back();
  };

  return (
    <View className="flex-1 bg-black px-6 pt-16" style={{ backgroundColor: '#0D0D0D' }}>
      <View className="flex-row justify-between items-center mb-10">
        <TouchableOpacity onPress={() => router.back()} className="p-3 bg-zinc-900 rounded-full">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} className="p-3 bg-red-500/10 rounded-full border border-red-500/30">
          <Trash2 size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View className="items-center mb-10 animate-bounce">
        <PlantVisual stage={habit.plantStage} size={150} health={100} />
      </View>

      <Text className="text-4xl font-black text-white text-center mb-2">{habit.title}</Text>
      <Text className="text-xl text-green-400 font-bold text-center mb-10">
        🔥 {habit.streak} Day Streak
      </Text>

      <View className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 flex-row justify-between">
        <View className="items-center">
          <Text className="text-zinc-400 font-medium mb-1">Longest Streak</Text>
          <Text className="text-3xl font-bold text-white">{habit.longestStreak}</Text>
        </View>
        <View className="w-[1px] bg-zinc-800" />
        <View className="items-center">
          <Text className="text-zinc-400 font-medium mb-1">Growth Score</Text>
          <Text className="text-3xl font-bold text-white">{habit.growthScore}%</Text>
        </View>
      </View>

      <View className="mt-8 items-center px-4">
        <Text className="text-center text-zinc-500 text-lg italic tracking-wide">
          "Consistency grows life. Water your garden."
        </Text>
      </View>
    </View>
  );
}