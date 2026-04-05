import { ScrollView, StatusBar, Text, View } from "react-native";
import { useHabitStore } from "../../store/useHabitStore";
import { getTodayStr } from "../../utils/habitUtils";

// Helper to get the last 7 days for the chart
const getPast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    dates.push({ dateStr, dayName });
  }
  return dates;
};

export default function Insights() {
  const { habits } = useHabitStore();
  const todayStr = getTodayStr();

  // Calculations
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) =>
    h.completedDates.includes(todayStr),
  ).length;
  const totalPetals = habits.reduce((sum, h) => sum + h.streak, 0);
  const bestStreak =
    habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  const completionRate =
    totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);

  const past7Days = getPast7Days();
  const maxPossibleCompletions = totalHabits || 1; // avoid division by zero

  const weekData = past7Days.map((day) => {
    const completedCount = habits.filter((h) =>
      h.completedDates.includes(day.dateStr),
    ).length;
    return {
      dayName: day.dayName[0], // Just M, T, W, T, F, S, S
      count: completedCount,
      percentage: (completedCount / maxPossibleCompletions) * 100,
    };
  });

  return (
    <View className="flex-1 bg-[#09090b] justify-start relative">
      <StatusBar barStyle="light-content" />

      {/* Aesthetic Background Gradient Orbs */}
      <View className="absolute top-[-100] left-[-100] w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px] opacity-40" />
      <View className="absolute top-[30%] right-[-50] w-72 h-72 bg-emerald-900/20 rounded-full blur-[80px] opacity-40" />

      {/* Header */}
      <View className="px-6 pt-20 pb-4 z-10 bg-transparent flex-row justify-between items-end">
        <View>
          <Text className="text-3xl font-bold text-white tracking-tight">
            Insights
          </Text>
          <Text className="text-zinc-400 mt-1 text-[15px] font-medium">
            Your growth at a glance
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Stats (2x2 Grid) */}
        <View className="flex-row flex-wrap justify-between mb-2">
          {/* Stat Card 1 */}
          <View className="w-[48%] bg-zinc-900/60 border border-zinc-800 rounded-[28px] p-5 mb-4">
            <View className="w-10 h-10 bg-emerald-900/30 rounded-full items-center justify-center mb-4">
              <Text className="text-lg">🌸</Text>
            </View>
            <Text className="text-3xl font-semibold text-white tracking-tight">
              {totalPetals}
            </Text>
            <Text className="text-zinc-500 text-[11px] font-bold mt-1 uppercase tracking-widest">
              Total Petals
            </Text>
          </View>

          {/* Stat Card 2 */}
          <View className="w-[48%] bg-zinc-900/60 border border-zinc-800 rounded-[28px] p-5 mb-4">
            <View className="w-10 h-10 bg-orange-900/20 rounded-full items-center justify-center mb-4">
              <Text className="text-lg">🔥</Text>
            </View>
            <Text className="text-3xl font-semibold text-white tracking-tight">
              {bestStreak}
            </Text>
            <Text className="text-zinc-500 text-[11px] font-bold mt-1 uppercase tracking-widest">
              Best Streak
            </Text>
          </View>

          {/* Stat Card 3 */}
          <View className="w-[48%] bg-zinc-900/60 border border-zinc-800 rounded-[28px] p-5 mb-4">
            <View className="w-10 h-10 bg-blue-900/20 rounded-full items-center justify-center mb-4">
              <Text className="text-lg">✨</Text>
            </View>
            <Text className="text-3xl font-semibold text-white tracking-tight">
              {completionRate}%
            </Text>
            <Text className="text-zinc-500 text-[11px] font-bold mt-1 uppercase tracking-widest">
              Today's Rate
            </Text>
          </View>

          {/* Stat Card 4 */}
          <View className="w-[48%] bg-zinc-900/60 border border-zinc-800 rounded-[28px] p-5 mb-4">
            <View className="w-10 h-10 bg-purple-900/20 rounded-full items-center justify-center mb-4">
              <Text className="text-lg">🌱</Text>
            </View>
            <Text className="text-3xl font-semibold text-white tracking-tight">
              {totalHabits}
            </Text>
            <Text className="text-zinc-500 text-[11px] font-bold mt-1 uppercase tracking-widest">
              Active Habits
            </Text>
          </View>
        </View>

        {/* Weekly Consistency Bar Chart */}
        <View className="bg-zinc-900/60 border border-zinc-800 rounded-[28px] p-6 mb-8 mt-2">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-white text-lg font-semibold tracking-tight">
              Last 7 Days
            </Text>
            <Text className="text-emerald-500 font-bold text-xs bg-emerald-500/10 px-2 py-1 rounded-md">
              ACTIVITY
            </Text>
          </View>

          <View className="flex-row justify-between items-end h-32 px-2">
            {weekData.map((data, index) => {
              const isToday = index === weekData.length - 1;
              // Ensure a minimum height for the bar so it's always visible even at 0%
              const barHeight = Math.max(data.percentage, 8);

              return (
                <View key={index} className="items-center w-8">
                  <View className="w-full h-full justify-end items-center mb-3">
                    <View
                      className={`w-[14px] rounded-full ${isToday ? "bg-emerald-500" : "bg-emerald-900/50"}`}
                      style={{ height: `${barHeight}%` }}
                    />
                  </View>
                  <Text
                    className={`text-[13px] font-bold ${isToday ? "text-emerald-400" : "text-zinc-600"}`}
                  >
                    {data.dayName}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
