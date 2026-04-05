import { BlurView } from 'expo-blur';
import { FlatList, Image, StatusBar, Text, View } from 'react-native';
import FloatingButton from '../../components/FloatingButton';
import HabitCard from '../../components/HabitCard';
import { useHabitStore } from '../../store/useHabitStore';
import { useProfileStore } from '../../store/useProfileStore';
import { getTodayStr } from '../../utils/habitUtils';

export default function Home() {
  const { habits, toggleHabitCompletion } = useHabitStore();
  const { name, avatarUri } = useProfileStore();
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
      
      {/* Aesthetic Background Gradient Orbs - Subdued */}
      <View className="absolute top-[-100] left-[-100] w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px] opacity-30" />
      <View className="absolute top-[20%] right-[30%] w-72 h-72 bg-indigo-900/10 rounded-full blur-[100px] opacity-20" />

      {/* Glassmorphic Header - Minimal */}
      <View className="z-10 bg-transparent flex-row justify-between items-center px-6 pt-20 pb-6 rounded-b-[32px] overflow-hidden border-b border-white/5">
        <View className="absolute inset-0">
          <BlurView intensity={20} tint="dark" className="flex-1 bg-black/40" />
        </View>
        <View className="flex-1">
          <Text className="text-xs text-zinc-400 font-medium uppercase tracking-widest mb-1">{greeting}</Text>
          <Text className="text-3xl font-bold text-white tracking-tight" numberOfLines={1}>{name} <Text className="text-2xl">{emoji}</Text></Text>
        </View>
        {(avatarUri || name !== 'Gardener') && (
          <View className="w-12 h-12 rounded-full ml-4 border border-zinc-800 bg-zinc-900 overflow-hidden items-center justify-center">
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} className="w-full h-full" />
            ) : (
              <Text className="text-xl">🧑‍🌾</Text>
            )}
          </View>
        )}
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