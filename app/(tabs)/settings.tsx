import { Text, TouchableOpacity, View } from 'react-native';
import { useHabitStore } from '../../store/useHabitStore';

export default function Settings() {
  return (
    <View className="flex-1 justify-center items-center px-4" style={{ backgroundColor: '#0D0D0D' }}>
      <Text className="text-4xl text-white font-extrabold mb-8">Settings ⚙️</Text>
      
      <TouchableOpacity 
        className="bg-red-500/20 border-2 border-red-500 rounded-xl px-6 py-4"
        onPress={() => useHabitStore.setState({ habits: [] })}
      >
        <Text className="text-red-500 font-bold text-xl">Reset All Habits</Text>
      </TouchableOpacity>
    </View>
  );
}