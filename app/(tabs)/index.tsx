import { BlurView } from 'expo-blur';
import { FlatList, StatusBar, Text, View } from 'react-native';
import FloatingButton from '../../components/FloatingButton';
import HabitCard from '../../components/HabitCard';
import { useHabitStore } from '../../store/useHabitStore';
import { getTodayStr } from '../../utils/habitUtils';

export default function Home() {
  const { habits, toggleHabitCompletion } = useHabitStore();
  const todayStr = getTodayStr();

  const hour = new Date().getHours();
  let greeting = 'Good evening,';
  let emoji = '🌙';

  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning,';
    emoji = '🌅';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon,';
    emoji = '☀️';
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening,';
    emoji = '🌆';
  } else {
    greeting = 'Good night,';
    emoji = '🌙';
  }

  return (
    <View className="flex-1 bg-[#09090b] justify-start relative">
      <StatusBar barStyle="light-content" />
      
      {/* Aesthetic Background Gradient Orbs */}
      <View className="absolute top-[-100] left-[-100] w-96 h-96 bg-emerald-900/30 rounded-full blur-[100px] opacity-60" />
      <View className="absolute top-[20%] right-[30%] w-72 h-72 bg-indigo-900/20 rounded-full blur-[80px] opacity-40" />

      {/* Glassmorphic Header */}
      <View className="z-10 bg-transparent flex-row justify-between items-center px-6 pt-20 pb-8 rounded-b-[40px] overflow-hidden border-b border-white/5 shadow-2xl shadow-black">
        <View className="absolute inset-0">
          <BlurView intensity={30} tint="dark" className="flex-1 bg-black/40" />
        </View>
        <View>
          <Text className="text-sm text-emerald-300/80 font-bold uppercase tracking-widest mb-1.5 shadow-sm">{greeting}</Text>
          <Text className="text-4xl font-black text-white tracking-tight drop-shadow-lg">Swarup <Text className="text-3xl">{emoji}</Text></Text>
        </View>
      </View>

      {/* Main Content */}
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24, paddingTop: 32, paddingBottom: 150 }}
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
          <View className="flex-1 items-center justify-center pt-24 px-8">
            <View className="w-28 h-28 bg-emerald-500/10 rounded-full items-center justify-center mb-8 border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
              <Text className="text-6xl drop-shadow-2xl">🌱</Text>
            </View>
            <Text className="text-3xl font-extrabold text-white mb-3 text-center tracking-wide">Begin Your Journey</Text>
            <Text className="text-base text-zinc-400 text-center leading-relaxed font-medium">Your daily actions grow your beautiful garden. Plant your first seed today.</Text>
          </View>
        }
      />

      <FloatingButton />
    </View>
  );
}