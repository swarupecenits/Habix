import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Habit } from '../types/habit';
import PlantVisual from './PlantVisual';

type HabitCardProps = {
  habit: Habit;
  isCompletedToday: boolean;
  onToggle: () => void;
};

export default function HabitCard({ habit, isCompletedToday, onToggle }: HabitCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/habit/${habit.id}`);
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isCompletedToday ? 1.02 : 1) }],
    };
  });

  return (
    <Animated.View style={containerStyle} className="bg-zinc-900 rounded-[20px] p-4 mb-4 shadow-lg flex-row items-center border border-zinc-800">
      <TouchableOpacity className="flex-row flex-1" onPress={handlePress} activeOpacity={0.8}>
        <View className="mr-4">
          <PlantVisual stage={habit.plantStage} size={56} health={isCompletedToday ? 100 : 80} />
        </View>
        <View className="flex-1 justify-center">
          <Text className="text-xl font-bold text-slate-100 mb-1">{habit.title}</Text>
          <Text className="text-sm text-slate-400">{habit.streak} day streak</Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onToggle}
        className={`w-12 h-12 rounded-full items-center justify-center border-2 ${isCompletedToday ? 'bg-green-500 border-green-500' : 'border-zinc-600'}`}
      >
        {isCompletedToday && <Check size={24} color="black" strokeWidth={3} />}
      </TouchableOpacity>
    </Animated.View>
  );
}