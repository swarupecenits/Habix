import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { FloraType, PlantStage } from '../types/habit';

type PlantVisualProps = {
  stage: PlantStage;
  health?: number; 
  size?: number;
  floraType?: FloraType;
};

export default function PlantVisual({ stage, health = 100, size = 64, floraType = 'oak' }: PlantVisualProps) {
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
    if (floraType === 'vine') {
      switch (stage) {
        case 0:
          return (
            <G>
              <Path d="M 20 85 Q 50 70 80 85 Z" fill="url(#soil)" />
              <Circle cx="50" cy="78" r="6" fill="#9333ea" />
            </G>
          );
        case 1:
          return (
            <G>
              <Path d="M 20 85 Q 50 70 80 85 Z" fill="url(#soil)" />
              <Path d="M 50 85 Q 35 70 55 55" stroke="#22c55e" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <Circle cx="55" cy="55" r="6" fill="url(#leafLight)" />
              <Circle cx="45" cy="65" r="5" fill="url(#leafMid)" />
            </G>
          );
        case 2:
          return (
            <G>
              <Path d="M 15 85 Q 50 65 85 85 Z" fill="url(#soil)" />
              <Path d="M 50 85 Q 30 65 55 45 T 45 25" stroke="#16a34a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <Circle cx="35" cy="55" r="9" fill="url(#leafMid)" />
              <Circle cx="55" cy="45" r="11" fill="url(#leafLight)" />
              <Circle cx="42" cy="25" r="8" fill="url(#leafHighlight)" />
              {/* Tiny grape cluster budding */}
              <Circle cx="45" cy="50" r="3.5" fill="#a855f7" />
              <Circle cx="50" cy="50" r="3.5" fill="#9333ea" />
              <Circle cx="47.5" cy="54" r="3.5" fill="#7e22ce" />
            </G>
          );
        case 3:
          return (
            <G>
              <Path d="M 10 90 Q 50 75 90 90 Z" fill="url(#soil)" />
              <Path d="M 50 85 Q 20 55 60 35 T 35 5" stroke="#15803d" strokeWidth="5.5" fill="none" strokeLinecap="round" />
              <Path d="M 50 85 Q 70 65 40 45" stroke="#16a34a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              
              <Circle cx="28" cy="48" r="14" fill="url(#leafDark)" />
              <Circle cx="62" cy="35" r="15" fill="url(#leafMid)" />
              <Circle cx="40" cy="20" r="12" fill="url(#leafLight)" />
              
              {/* Grape Cluster 1 */}
              <Circle cx="35" cy="60" r="4.5" fill="#c084fc" />
              <Circle cx="42" cy="60" r="4.5" fill="#a855f7" />
              <Circle cx="38.5" cy="65" r="4.5" fill="#9333ea" />
              <Circle cx="45.5" cy="65" r="4.5" fill="#9333ea" />
              <Circle cx="42" cy="70" r="4.5" fill="#7e22ce" />
              
              {/* Grape Cluster 2 */}
              <Circle cx="55" cy="40" r="4" fill="#a855f7" />
              <Circle cx="61" cy="40" r="4" fill="#9333ea" />
              <Circle cx="58" cy="45" r="4" fill="#7e22ce" />
            </G>
          );
        case 4:
          return (
            <G>
              <Path d="M 0 90 Q 50 75 100 90 Z" fill="url(#soil)" />
              {/* Double twisted majestic vine stems */}
              <Path d="M 50 85 Q 10 50 65 30 T 35 -5" stroke="#14532d" strokeWidth="6.5" fill="none" strokeLinecap="round" />
              <Path d="M 50 85 Q 80 60 35 40 T 65 5" stroke="#16a34a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <Path d="M 40 45 Q 20 30 10 15" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              <Circle cx="20" cy="45" r="18" fill="url(#leafDark)" />
              <Circle cx="15" cy="30" r="14" fill="url(#leafMid)" />
              <Circle cx="70" cy="35" r="20" fill="url(#leafMid)" />
              <Circle cx="45" cy="15" r="16" fill="url(#leafLight)" />
              <Circle cx="60" cy="8" r="14" fill="url(#leafHighlight)" opacity="0.9" />
              <Circle cx="30" cy="-2" r="12" fill="url(#leafLight)" />
              <Circle cx="80" cy="20" r="10" fill="url(#leafDark)" opacity="0.8" />

              {/* Big Grape Cluster Left */}
              <G transform="translate(25, 55)">
                <Circle cx="0" cy="0" r="5.5" fill="#c084fc" />
                <Circle cx="9" cy="0" r="5.5" fill="#a855f7" />
                <Circle cx="18" cy="0" r="5.5" fill="#9333ea" />
                <Circle cx="4.5" cy="8" r="5.5" fill="#a855f7" />
                <Circle cx="13.5" cy="8" r="5.5" fill="#9333ea" />
                <Circle cx="9" cy="16" r="5.5" fill="#7e22ce" />
              </G>

              {/* Medium Grape Cluster Right */}
              <G transform="translate(60, 42)">
                <Circle cx="0" cy="0" r="5" fill="#a855f7" />
                <Circle cx="8" cy="0" r="5" fill="#9333ea" />
                <Circle cx="16" cy="0" r="5" fill="#7e22ce" />
                <Circle cx="4" cy="7" r="5" fill="#9333ea" />
                <Circle cx="12" cy="7" r="5" fill="#7e22ce" />
                <Circle cx="8" cy="14" r="5" fill="#581c87" />
              </G>

              {/* Small Grape Cluster Top */}
              <G transform="translate(42, 22)">
                <Circle cx="0" cy="0" r="4.5" fill="#c084fc" />
                <Circle cx="8" cy="0" r="4.5" fill="#a855f7" />
                <Circle cx="4" cy="6" r="4.5" fill="#9333ea" />
              </G>
            </G>
          );
        default:
          return null;
      }
    }

    // Default switch for Oak and Bamboo
    switch (stage) {
      case 0:
        return (
          <G>
            <Path d="M 20 85 Q 50 70 80 85 Z" fill="url(#soil)" />
            <Circle cx="50" cy="78" r="6" fill={floraType === 'bamboo' ? '#bef264' : 'url(#leafLight)'} />
          </G>
        );
      case 1:
        return (
          <G>
            <Path d="M 20 85 Q 50 70 80 85 Z" fill="url(#soil)" />
            <Rect x={floraType === 'bamboo' ? "48" : "48.5"} y="60" width={floraType === 'bamboo' ? "4" : "3"} height="20" fill={floraType === 'bamboo' ? "#a3e635" : "#4ade80"} />
            <Circle cx="42" cy="65" r={floraType === 'bamboo' ? "6" : "8"} fill={floraType === 'bamboo' ? "#84cc16" : "url(#leafMid)"} />
            <Circle cx="58" cy="62" r={floraType === 'bamboo' ? "6" : "8"} fill={floraType === 'bamboo' ? "#bef264" : "url(#leafLight)"} />
          </G>
        );
      case 2:
        return (
          <G>
            <Path d="M 15 85 Q 50 65 85 85 Z" fill="url(#soil)" />
            <Rect x="47" y="45" width="6" height="35" fill={floraType === 'bamboo' ? "#84cc16" : "#22c55e"} />
            {floraType === 'bamboo' && <Rect x="45" y="60" width="10" height="2" fill="#4d7c0f" />}
            {floraType === 'bamboo' && <Rect x="45" y="75" width="10" height="2" fill="#4d7c0f" />}
            
            <Circle cx="35" cy="58" r={floraType === 'bamboo' ? "8" : "12"} fill={floraType === 'bamboo' ? "#65a30d" : "url(#leafDark)"} />
            <Circle cx="65" cy="55" r={floraType === 'bamboo' ? "8" : "12"} fill={floraType === 'bamboo' ? "#84cc16" : "url(#leafMid)"} />
            <Circle cx="50" cy="40" r={floraType === 'bamboo' ? "10" : "16"} fill={floraType === 'bamboo' ? "#bef264" : "url(#leafLight)"} />
          </G>
        );
      case 3:
        return (
          <G>
            <Path d="M 10 90 Q 50 75 90 90 Z" fill="url(#soil)" />
            <Path d={floraType === 'bamboo' ? "M 46 85 L 46 30 L 54 30 L 54 85 Z" : "M 46 85 L 48 45 L 52 45 L 54 85 Z"} fill={floraType === 'bamboo' ? "transparent" : "url(#trunk)"} stroke={floraType === 'bamboo' ? "none" : "none"} strokeWidth="0" />
            
            {floraType === 'bamboo' && (
              <>
                <Rect x="46" y="30" width="8" height="55" fill="#65a30d" />
                <Rect x="44" y="45" width="12" height="3" fill="#4d7c0f" />
                <Rect x="44" y="60" width="12" height="3" fill="#4d7c0f" />
                <Rect x="44" y="75" width="12" height="3" fill="#4d7c0f" />
              </>
            )}

            <Circle cx={floraType === 'bamboo' ? "35" : "30"} cy={floraType === 'bamboo' ? "45" : "55"} r={floraType === 'bamboo' ? "12" : "20"} fill={floraType === 'bamboo' ? "#65a30d" : "url(#leafDark)"} />
            <Circle cx={floraType === 'bamboo' ? "65" : "70"} cy={floraType === 'bamboo' ? "50" : "55"} r={floraType === 'bamboo' ? "12" : "20"} fill={floraType === 'bamboo' ? "#84cc16" : "url(#leafMid)"} />
            <Circle cx="50" cy={floraType === 'bamboo' ? "25" : "38"} r={floraType === 'bamboo' ? "16" : "26"} fill={floraType === 'bamboo' ? "#bef264" : "url(#leafLight)"} />
            {floraType !== 'bamboo' && <Circle cx="50" cy="52" r="22" fill="url(#leafHighlight)" opacity="0.9" />}
          </G>
        );
      case 4:
        return (
          <G>
            <Path d="M 0 90 Q 50 75 100 90 Z" fill="url(#soil)" />
            <Path d={floraType === 'bamboo' ? "M 44 85 L 44 15 L 56 15 L 56 85 Z" : "M 40 85 L 45 35 L 55 35 L 60 85 Z"} fill={floraType === 'bamboo' ? "#65a30d" : "url(#trunk)"} />
            
            {floraType === 'bamboo' && (
              <>
                <Rect x="42" y="30" width="16" height="3" fill="#3f6212" />
                <Rect x="42" y="50" width="16" height="3" fill="#3f6212" />
                <Rect x="42" y="70" width="16" height="3" fill="#3f6212" />
                <Circle cx="25" cy="35" r="18" fill="#84cc16" />
                <Circle cx="75" cy="45" r="18" fill="#bef264" />
                <Circle cx="50" cy="10" r="22" fill="#d9f99d" />
              </>
            )}

            {floraType === 'oak' && (
              <>
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
              </>
            )}
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