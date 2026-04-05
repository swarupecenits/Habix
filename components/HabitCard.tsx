import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Habit } from '../types/habit';
import PlantVisual from './PlantVisual';

type HabitCardProps = {
  habit: Habit;
  isCompletedToday: boolean;
  onToggle: () => void;
};

export default function HabitCard({ habit, isCompletedToday, onToggle }: HabitCardProps) {
  const router = useRouter();

  const rippleScale1 = useSharedValue(1);
  const rippleOpacity1 = useSharedValue(0);
  const rippleScale2 = useSharedValue(1);
  const rippleOpacity2 = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    if (isCompletedToday) {
      // Quick pop of the icon itself
      iconScale.value = 0.5;
      iconScale.value = withSpring(1, { damping: 10, stiffness: 80 });

      // Ripple 1
      rippleScale1.value = 1;
      rippleOpacity1.value = 0.6;
      rippleScale1.value = withTiming(2.8, { duration: 600, easing: Easing.out(Easing.quad) });
      rippleOpacity1.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) });

      // Ripple 2
      setTimeout(() => {
        rippleScale2.value = 1;
        rippleOpacity2.value = 0.4;
        rippleScale2.value = withTiming(2.5, { duration: 600, easing: Easing.out(Easing.quad) });
        rippleOpacity2.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) });
      }, 150);
    }
  }, [isCompletedToday]);

  const handlePress = () => {
    router.push(`/habit/${habit.id}`);
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isCompletedToday ? 1.02 * cardScale.value : 1 * cardScale.value) }
      ],
    };
  });

  const rippleStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale1.value }],
    opacity: rippleOpacity1.value,
  }));

  const rippleStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale2.value }],
    opacity: rippleOpacity2.value,
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }]
  }));

  return (
    <Animated.View style={containerStyle} className="mb-3">
      <View className={`rounded-[20px] overflow-hidden border ${isCompletedToday ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-zinc-900/40 border-zinc-800/50'}`}>
        <Pressable 
          className="p-4 py-4 flex-row items-center" 
          onPress={handlePress} 
          onPressIn={() => { cardScale.value = withSpring(0.95); }}
          onPressOut={() => { cardScale.value = withSpring(1); }}
        >
          <View className="flex-row flex-1 items-center">
            <View className={`mr-4 p-2 rounded-2xl ${isCompletedToday ? 'bg-emerald-900/10' : 'bg-zinc-800/30'}`}>
              <PlantVisual stage={habit.plantStage} size={44} health={isCompletedToday ? 100 : 80} floraType={habit.floraType} />
            </View>
            <View className="flex-1 justify-center">
              <Text className={`text-lg font-semibold mb-0.5 tracking-tight ${isCompletedToday ? 'text-emerald-50' : 'text-zinc-200'}`}>
                {habit.title}
              </Text>
              <Text className="text-[13px] text-zinc-500 font-medium">
                {habit.streak} {habit.streak === 1 ? 'Petal' : 'Petals'} • {habit.floraType === 'oak' ? 'Oak' : habit.floraType === 'bamboo' ? 'Bamboo' : 'Vine'}
              </Text>
            </View>
          </View>
          
          <View className="ml-2 relative items-center justify-center">
            {/* The outer splash droplet ripples */}
            <Animated.View 
              style={[{ position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#34d399' }, rippleStyle1]} 
              pointerEvents="none" 
            />
            <Animated.View 
              style={[{ position: 'absolute', width: 44, height: 44, borderRadius: 22, backgroundColor: '#10b981' }, rippleStyle2]} 
              pointerEvents="none" 
            />
            <TouchableOpacity 
              onPress={onToggle}
              className={`w-12 h-12 rounded-full items-center justify-center border-2 transition-colors z-10 ${isCompletedToday ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-800/80 border-zinc-700'}`}
              activeOpacity={0.8}
            >
              <Animated.View style={iconAnimatedStyle}>
                {isCompletedToday && <Check size={20} color="#064e3b" strokeWidth={3} />}
              </Animated.View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}