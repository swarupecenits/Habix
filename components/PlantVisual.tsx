import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { PlantStage } from '../types/habit';

type PlantVisualProps = {
  stage: PlantStage;
  health?: number; 
  size?: number;
};

export default function PlantVisual({ stage, health = 100, size = 64 }: PlantVisualProps) {
  const sway = useSharedValue(0);

  useEffect(() => {
    // Gentle continuous swaying effect
    sway.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(1) },
      ],
      opacity: withTiming(health / 100, { duration: 500 }),
    };
  });

  const swayStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateZ: `${sway.value}deg` }
      ],
    };
  });

  const renderTree = () => {
    switch (stage) {
      case 0:
        return (
          <G>
            <Path d="M 20 85 Q 50 70 80 85 Z" fill="url(#soil)" />
            <Circle cx="50" cy="78" r="6" fill="url(#leafLight)" />
          </G>
        );
      case 1:
        return (
          <G>
            <Path d="M 20 85 Q 50 70 80 85 Z" fill="url(#soil)" />
            <Rect x="48.5" y="60" width="3" height="20" fill="#4ade80" />
            <Circle cx="42" cy="65" r="8" fill="url(#leafMid)" />
            <Circle cx="58" cy="62" r="8" fill="url(#leafLight)" />
          </G>
        );
      case 2:
        return (
          <G>
            <Path d="M 15 85 Q 50 65 85 85 Z" fill="url(#soil)" />
            <Rect x="47" y="50" width="6" height="30" fill="#22c55e" />
            <Circle cx="35" cy="58" r="12" fill="url(#leafDark)" />
            <Circle cx="65" cy="55" r="12" fill="url(#leafMid)" />
            <Circle cx="50" cy="40" r="16" fill="url(#leafLight)" />
          </G>
        );
      case 3:
        return (
          <G>
            <Path d="M 10 90 Q 50 75 90 90 Z" fill="url(#soil)" />
            <Path d="M 46 85 L 48 45 L 52 45 L 54 85 Z" fill="url(#trunk)" />
            <Circle cx="30" cy="55" r="20" fill="url(#leafDark)" />
            <Circle cx="70" cy="55" r="20" fill="url(#leafMid)" />
            <Circle cx="50" cy="38" r="26" fill="url(#leafLight)" />
            <Circle cx="50" cy="52" r="22" fill="url(#leafHighlight)" opacity="0.9" />
          </G>
        );
      case 4:
        return (
          <G>
            <Path d="M 0 90 Q 50 75 100 90 Z" fill="url(#soil)" />
            <Path d="M 40 85 L 45 35 L 55 35 L 60 85 Z" fill="url(#trunk)" />
            <Circle cx="20" cy="55" r="26" fill="url(#leafDark)" />
            <Circle cx="80" cy="55" r="26" fill="url(#leafDark)" />
            <Circle cx="32" cy="32" r="28" fill="url(#leafMid)" />
            <Circle cx="68" cy="32" r="28" fill="url(#leafMid)" />
            <Circle cx="50" cy="18" r="32" fill="url(#leafLight)" />
            <Circle cx="50" cy="45" r="30" fill="url(#leafHighlight)" />
            <Circle cx="50" cy="30" r="18" fill="#d9f99d" opacity="0.8" />
            <Circle cx="30" cy="65" r="6" fill="#fbcfe8" opacity="0.8" />
            <Circle cx="75" cy="40" r="5" fill="#fbcfe8" opacity="0.8" />
            <Circle cx="60" cy="20" r="7" fill="#fbcfe8" opacity="0.8" />
            <Circle cx="40" cy="25" r="4" fill="#fbcfe8" opacity="0.8" />
          </G>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View 
      className="items-center justify-center rounded-full bg-zinc-900 shadow-md"
      style={[{ width: size, height: size }, animatedStyle]}
    >
      <Animated.View style={[swayStyle, { width: '100%', height: '100%', transformOrigin: 'bottom center' as any }]}>
        <Svg height="100%" width="100%" viewBox="-10 -15 120 120">
          <Defs>
            <LinearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#3f3f46" stopOpacity="1" />
              <Stop offset="1" stopColor="#18181b" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="trunk" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#78350f" stopOpacity="1" />
              <Stop offset="0.5" stopColor="#92400e" stopOpacity="1" />
              <Stop offset="1" stopColor="#451a03" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="leafDark" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#16a34a" stopOpacity="1" />
              <Stop offset="1" stopColor="#064e3b" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="leafMid" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#22c55e" stopOpacity="1" />
              <Stop offset="1" stopColor="#14532d" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="leafLight" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#4ade80" stopOpacity="1" />
              <Stop offset="1" stopColor="#166534" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="leafHighlight" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#a3e635" stopOpacity="1" />
              <Stop offset="1" stopColor="#22c55e" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          {renderTree()}
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}