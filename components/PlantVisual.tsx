import { Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { PlantStage } from '../types/habit';

type PlantVisualProps = {
  stage: PlantStage;
  health?: number; 
  size?: number;
};

export default function PlantVisual({ stage, health = 100, size = 64 }: PlantVisualProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(1) }],
      opacity: withTiming(health / 100, { duration: 500 }),
    };
  });

  const getEmoji = () => {
    switch (stage) {
      case 0: return '🌱'; // Seed
      case 1: return '🌿'; // Sprout
      case 2: return '🌾'; // Small plant
      case 3: return '🌳'; // Growing plant
      case 4: return '🌸'; // Full bloom
      default: return '🌱';
    }
  };

  return (
    <Animated.View 
      className="items-center justify-center rounded-full bg-zinc-800"
      style={[
        { width: size, height: size },
        animatedStyle
      ]}
    >
      <Text style={{ fontSize: size * 0.5 }}>{getEmoji()}</Text>
    </Animated.View>
  );
}