import { FlatList, Text, View } from 'react-native';
import FloatingButton from '../../components/FloatingButton';
import HabitCard from '../../components/HabitCard';
import { useHabitStore } from '../../store/useHabitStore';
import { getTodayStr } from '../../utils/habitUtils';

export default function Home() {
  const { habits, toggleHabitCompletion } = useHabitStore();
  const todayStr = getTodayStr();

  return (
    <View className="flex-1 bg-black justify-start" style={{ backgroundColor: '#0D0D0D' }}>
      <View className="px-6 pt-16 pb-6 shadow-sm border-b border-zinc-900 bg-zinc-950">
        <Text className="text-xl text-slate-400 font-medium tracking-wide">Good evening,</Text>
        <Text className="text-4xl font-extrabold text-white mt-1">Swarup 🌙</Text>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isCompleted = item.completedDates.includes(todayStr);
          return (
            <HabitCard 
              habit={item} 
              isCompletedToday={isCompleted} 
              onToggle={() => toggleHabitCompletion(item.id, todayStr)} 
            />
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-32">
            <Text className="text-6xl mb-4">🌱</Text>
            <Text className="text-2xl font-bold text-white mb-2">No habits yet</Text>
            <Text className="text-lg text-zinc-500 text-center px-4">Your daily actions grow your garden. Start planting seeds today.</Text>
          </View>
        }
      />

      <FloatingButton />
    </View>
  );
}