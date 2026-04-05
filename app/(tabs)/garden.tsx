import { BlurTint, BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { Dimensions, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import PlantVisual from '../../components/PlantVisual';
import { useHabitStore } from '../../store/useHabitStore';
import { Habit } from '../../types/habit';
import { getPlantStage } from '../../utils/habitUtils';

const { width } = Dimensions.get('window');

const AnimatedFlower = ({ habit, index }: { habit: Habit; index: number }) => {
  const pulse = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const delay = index * 200;
    const timeout = setTimeout(() => {
      pulse.value = withRepeat(
        withSequence(withTiming(1.1, { duration: 1500 }), withTiming(1, { duration: 1500 })),
        -1,
        true
      );
      rotate.value = withRepeat(
        withTiming(360, { duration: 25000, easing: Easing.linear }),
        -1,
        false
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const spinStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }] }));

  // Represent days with petals (capped visually at 24 to not overcrowd the SVG)
  const visualPetals = Math.max(5, Math.min(habit.streak, 24)); 
  const bloomColor = habit.color && habit.color !== '' ? habit.color : '#fbcfe8';

  return (
    <View className="items-center justify-center">
      <Animated.View style={[{ width: 75, height: 75 }, scaleStyle]}>
        <Animated.View style={[{ flex: 1 }, spinStyle]}>
          <Svg viewBox="0 0 100 100">
            {Array.from({ length: visualPetals }).map((_, i) => {
              const angle = (i * 360) / visualPetals;
              const rad = angle * (Math.PI / 180);
              const cx = 50 + Math.cos(rad) * 22;
              const cy = 50 + Math.sin(rad) * 22;
              return <Circle key={i} cx={cx} cy={cy} r="16" fill={bloomColor} opacity="0.85" />;
            })}
            <Circle cx="50" cy="50" r="14" fill="#fef08a" shadowColor="#000" />
            <Circle cx="50" cy="50" r="10" fill="#facc15" />
          </Svg>
        </Animated.View>
      </Animated.View>

      <BlurView 
        intensity={60} 
        tint={'dark' as BlurTint} 
        className="rounded-2xl px-3 py-1.5 mt-1 items-center border border-white/20 shadow-xl overflow-hidden" 
        style={{ maxWidth: 96 }}
      >
        <Text className="text-white text-[11px] font-bold text-center tracking-wide" numberOfLines={1}>{habit.title}</Text>
        <Text className="text-[10px] font-extrabold text-center mt-0.5 shadow-sm" style={{ color: bloomColor }}>{habit.streak} Petals</Text>
      </BlurView>
    </View>
  );
};

export default function Garden() {
  const habits = useHabitStore((state) => state.habits);

  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const grandTreeStage = getPlantStage(maxStreak);

  return (
    <View className="flex-1 bg-black pt-16" style={{ backgroundColor: '#0D0D0D' }}>
      <View className="px-6 mb-10 mt-4 z-20 items-center">
        <Text className="text-4xl text-emerald-100 font-extrabold mb-1 tracking-wider text-center drop-shadow-xl shadow-green-500/20">The Grand Tree</Text>
        <Text className="text-sm text-emerald-400/60 tracking-widest uppercase font-bold text-center">Nourished by your consistency</Text>
      </View>

      <View className="flex-1 justify-center items-center relative overflow-hidden">
        {/* The Master Tree Background */}
        <View className="absolute z-0 opacity-100" style={{ transform: [{ translateY: 0 }] }}>
          {habits.length > 0 ? (
            <PlantVisual stage={grandTreeStage} size={width * 1.15} health={100} />
          ) : (
            <PlantVisual stage={0} size={width * 0.8} health={50} />
          )}
        </View>

        {/* Orbiting Habits as Blooming Flowers */}
        {habits.map((habit, index) => {
          const goldenAngle = 2.4; 
          const angle = index * goldenAngle;
          
          // Max allowed radius so flowers don't go off-screen
          // width/2 is the center. Subtract 50px so the flower plus a margin stays on screen.
          const maxRadius = (width / 2) - 50; 
          
          // Dynamically space out the spiral, but cap it at maxRadius
          const calculatedRadius = 70 + (index * 20); 
          const radius = Math.min(calculatedRadius, maxRadius);
          
          const xPos = Math.cos(angle) * radius;
          const yPos = Math.sin(angle) * (radius * 1.1); // Slightly taller vertically

          return (
            <View 
              key={habit.id} 
              className="absolute z-10"
              style={{
                transform: [
                  { translateX: xPos },
                  { translateY: yPos - 20 }
                ],
              }}
            >
              <AnimatedFlower habit={habit} index={index} />
            </View>
          );
        })}

        {habits.length === 0 && (
          <View className="bg-black/60 px-8 py-6 rounded-3xl border border-white/10 z-10 shadow-emerald-500/10 shadow-2xl">
            <Text className="text-slate-200 text-center font-bold tracking-widest uppercase text-lg">Your garden awaits</Text>
            <Text className="text-emerald-500/80 text-center text-sm mt-2 font-medium">Plant a seed to begin</Text>
          </View>
        )}
      </View>
    </View>
  );
}