import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useProfileStore } from '../store/useProfileStore';

export default function FloatingButton() {
  const router = useRouter();
  const hapticsEnabled = useProfileStore((state) => state.hapticsEnabled);
  
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  return (
    <Animated.View
      className="absolute flex justify-center items-center rounded-full bg-green-500 shadow-xl"
      style={[
        { 
          width: 64, 
          height: 64, 
          right: 32, 
          bottom: 120, // Moved up to avoid overlapping with the floating tab bar
          elevation: 10, 
          shadowColor: '#4ADE80', 
          shadowOffset: { width: 0, height: 4 }, 
          shadowOpacity: 0.4, 
          shadowRadius: 8,
          zIndex: 50 
        },
        buttonStyle
      ]}
    >
      <Pressable
        style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 32 }}
        onPressIn={() => { buttonScale.value = withSpring(0.85); }}
        onPressOut={() => { buttonScale.value = withSpring(1); }}
        onPress={() => {
          if (hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          router.push('/add-habit');
        }}
      >
        <Plus color="black" size={32} strokeWidth={2.5} />
      </Pressable>
    </Animated.View>
  );
}