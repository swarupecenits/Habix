import { Text, View } from 'react-native';

export default function Garden() {
  return (
    <View className="flex-1 bg-black justify-center items-center px-4" style={{ backgroundColor: '#0D0D0D' }}>
      <Text className="text-4xl text-white font-extrabold mb-4">Garden 🌿</Text>
      <Text className="text-lg text-slate-400 text-center">Your long-term habits bloom here.</Text>
    </View>
  );
}