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
    <Animated.View style={containerStyle} className="mb-4">
      <View className={`rounded-[24px] overflow-hidden border ${isCompletedToday ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-zinc-900/60 border-zinc-800'}`}>
        <TouchableOpacity className="p-4 flex-row items-center" onPress={handlePress} activeOpacity={0.8}>
          <View className="flex-row flex-1 items-center">
            <View className={`mr-4 p-2 rounded-2xl ${isCompletedToday ? 'bg-emerald-900/20' : 'bg-zinc-800/50'}`}>
              <PlantVisual stage={habit.plantStage} size={48} health={isCompletedToday ? 100 : 80} floraType={habit.floraType} />
            </View>
            <View className="flex-1 justify-center">
              <Text className={`text-lg font-semibold mb-0.5 tracking-tight ${isCompletedToday ? 'text-white' : 'text-zinc-200'}`}>
                {habit.title}
              </Text>
              <Text className="text-[13px] text-zinc-400 font-medium">
                {habit.streak} {habit.streak === 1 ? 'Petal' : 'Petals'} • {habit.floraType === 'oak' ? 'Oak' : habit.floraType === 'bamboo' ? 'Bamboo' : 'Vine'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            onPress={onToggle}
            className={`w-12 h-12 rounded-full items-center justify-center border-2 ml-2 transition-colors ${isCompletedToday ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-800/80 border-zinc-700'}`}
          >
            {isCompletedToday && <Check size={24} color="#022c22" strokeWidth={3} />}
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}