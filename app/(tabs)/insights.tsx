import { Text, View } from 'react-native';

export default function Insights() {
  return (
    <View className="flex-1 bg-black justify-center items-center px-4" style={{ backgroundColor: '#0D0D0D' }}>
      <Text className="text-4xl text-white font-extrabold mb-4">Insights 📊</Text>
      <Text className="text-lg text-slate-400 text-center">Track your consistency.</Text>
    </View>
  );
}