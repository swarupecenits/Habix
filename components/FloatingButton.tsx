import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useProfileStore } from '../store/useProfileStore';

export default function FloatingButton() {
  const router = useRouter();
  const hapticsEnabled = useProfileStore((state) => state.hapticsEnabled);

  return (
    <TouchableOpacity
      className="absolute flex justify-center items-center rounded-full bg-green-500 shadow-xl"
      style={{ 
        width: 64, 
        height: 64, 
        right: 32, 
        bottom: 100, // Moved up to avoid overlapping with the floating tab bar
        elevation: 10, 
        shadowColor: '#4ADE80', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.4, 
        shadowRadius: 8,
        zIndex: 50 
      }}
      onPress={() => {
        if (hapticsEnabled) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        router.push('/add-habit');
      }}
    >
      <Plus color="black" size={32} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}