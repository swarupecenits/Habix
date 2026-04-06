import { useEffect } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useHabitStore } from "../../store/useHabitStore";
import { getTodayStr } from "../../utils/habitUtils";

// Helper to get the last 7 days for the chart
const getPast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    
    // Explicit local formatting to prevent timezone shifting
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    dates.push({ dateStr, dayName });
  }
  return dates;
};

const getMonthData = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const days = [];
  const firstDayOfWeek = firstDay.getDay(); // 0 = Sun
  
  // Padding for the previous month's empty slots
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  // Actual days in the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    // Exact local date formatting strings
    const year = now.getFullYear();
    const monthStr = String(now.getMonth() + 1).padStart(2, '0');
    const dayStr = String(i).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    
    days.push({ day: i, dateStr });
  }

  const monthName = now.toLocaleString("default", { month: "long" });
  return { monthName, year: now.getFullYear(), days };
};

const AnimatedBar = ({ percentage, isToday, index }: { percentage: number, isToday: boolean, index: number }) => {
  const heightVal = useSharedValue(0);

  useEffect(() => {
    const targetHeight = Math.max(percentage, 8);
    heightVal.value = withDelay(
      300 + index * 80, 
      withTiming(targetHeight, { duration: 1000, easing: Easing.out(Easing.cubic) })
    );
  }, [percentage, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${heightVal.value}%`
  }));

  return (
    <View className="w-full h-full justify-end items-center mb-3">
      <Animated.View
        className={`w-[14px] rounded-full ${isToday ? "bg-emerald-400" : "bg-emerald-900/60"}`}
        style={[animatedStyle, isToday && { shadowColor: '#34d399', shadowOffset: {width: 0, height: 0}, shadowOpacity: 0.8, shadowRadius: 8, elevation: 5 }]}
      />
    </View>
  );
};

export default function Insights() {
  const { habits } = useHabitStore();
  const todayStr = getTodayStr();

  // Calculations
  const totalHabits = habits.length;
  const completedToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const totalPetals = habits.reduce((sum, h) => sum + h.streak, 0);
  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;
  
  const completionRate = totalHabits === 0 ? 0 : Math.round((completedToday / totalHabits) * 100);
  
  // Top Habit
  const topHabit = habits.length > 0 ? [...habits].sort((a, b) => b.streak - a.streak)[0] : null;

  const past7Days = getPast7Days();
  const monthData = getMonthData();
  const maxPossibleCompletions = totalHabits || 1; // avoid division by zero

  const weekData = past7Days.map((day) => {
    const completedCount = habits.filter((h) => h.completedDates.includes(day.dateStr)).length;
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

      <Animated.View entering={FadeInDown.duration(700).easing(Easing.out(Easing.cubic))} className="px-6 pt-20 pb-4 z-10 bg-transparent flex-row justify-between items-end">
        <View>
          <Text className="text-3xl font-black text-white tracking-tight">Insights</Text>
          <Text className="text-emerald-400/80 mt-1 text-[13px] font-bold uppercase tracking-widest">
            {completionRate === 100 && totalHabits > 0 ? "Perfect Day 🌱" : completionRate > 50 ? "Growing Well 🌿" : "Needs Watering 💧"}
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Stats (2x2 Grid) */}
        <View className="flex-row flex-wrap justify-between mb-2">
          {[
            { title: 'Total Petals', val: totalPetals, icon: '🌸', color: 'bg-pink-900/30' },
            { title: 'Best Streak', val: bestStreak, icon: '🔥', color: 'bg-orange-900/20' },
            { title: 'All Waterings', val: totalCompletions, icon: '💦', color: 'bg-blue-900/20' },
            { title: 'Active Habits', val: totalHabits, icon: '🌱', color: 'bg-emerald-900/30' },
          ].map((stat, i) => (
            <Animated.View 
              key={i}
              entering={FadeInDown.delay(100 + i * 50).duration(700).easing(Easing.out(Easing.cubic))}
              className="w-[48%] bg-zinc-900/70 border border-zinc-800/80 rounded-[28px] p-5 mb-4 shadow-xl"
            >
              <View className={`w-12 h-12 ${stat.color} rounded-full items-center justify-center mb-4`}>
                <Text className="text-xl">{stat.icon}</Text>
              </View>
              <Text className="text-3xl font-black text-white tracking-tighter">
                {stat.val}
              </Text>
              <Text className="text-zinc-500 text-[11px] font-bold mt-1 uppercase tracking-widest">
                {stat.title}
              </Text>
            </Animated.View>
          ))}
        </View>

        {/* Top Habit Highlight */}
        {topHabit && topHabit.streak > 0 && (
          <Animated.View entering={FadeInDown.delay(300).duration(700).easing(Easing.out(Easing.cubic))} className="bg-emerald-950/30 border border-emerald-900/40 rounded-[28px] p-5 mb-8 flex-row items-center">
            <View className="w-14 h-14 bg-emerald-900/50 rounded-full items-center justify-center mr-4">
              <Text className="text-2xl">👑</Text>
            </View>
            <View className="flex-1">
              <Text className="text-emerald-400 text-[11px] font-black uppercase tracking-widest mb-1">Most Consistent</Text>
              <Text className="text-white text-xl font-bold tracking-tight">{topHabit.title}</Text>
              <Text className="text-emerald-200/60 text-sm mt-0.5">{topHabit.streak} days in a row</Text>
            </View>
          </Animated.View>
        )}

        {/* Weekly Consistency Bar Chart */}
        <Animated.View entering={FadeInDown.delay(400).duration(700).easing(Easing.out(Easing.cubic))} className="bg-zinc-900/70 border border-zinc-800/80 rounded-[32px] p-6 mb-8 mt-2 shadow-2xl">
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-white text-xl font-bold tracking-tight">Last 7 Days</Text>
              <Text className="text-zinc-500 text-xs font-medium mt-1">Daily completion rate</Text>
            </View>
            <View className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <Text className="text-emerald-400 font-bold text-xs tracking-wider">
                {completionRate}% TODAY
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-end h-40 px-1">
            {weekData.map((data, index) => {
              const isToday = index === weekData.length - 1;
              return (
                <View key={index} className="items-center w-8">
                  <AnimatedBar percentage={data.percentage} isToday={isToday} index={index} />
                  <Text className={`text-[13px] font-bold ${isToday ? "text-emerald-400 scale-110" : "text-zinc-600"}`}>
                    {data.dayName}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* LeetCode Style Monthly Calendar Heatmap */}
        <Animated.View entering={FadeInDown.delay(500).duration(700).easing(Easing.out(Easing.cubic))} className="bg-zinc-900/70 border border-zinc-800/80 rounded-[32px] p-6 mb-8 shadow-2xl">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white text-xl font-bold tracking-tight">Gardening Journal</Text>
              <Text className="text-emerald-500 text-xs font-bold mt-1 uppercase tracking-widest">{monthData.monthName} {monthData.year}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="text-[10px] text-zinc-600 font-bold mr-1 uppercase">Less</Text>
              <View className="w-[10px] h-[10px] rounded-[3px] bg-zinc-800/40 border border-zinc-800" />
              <View className="w-[10px] h-[10px] rounded-[3px] bg-emerald-900/80" />
              <View className="w-[10px] h-[10px] rounded-[3px] bg-emerald-600" />
              <View className="w-[10px] h-[10px] rounded-[3px] bg-emerald-400" />
              <Text className="text-[10px] text-emerald-500 font-bold ml-1 uppercase">More</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap mt-2">
            {/* Days of Week Header */}
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <View key={`header-${i}`} className="w-[14.28%] items-center mb-4">
                <Text className="text-zinc-600 text-[11px] font-black uppercase">{day}</Text>
              </View>
            ))}

            {/* Grid Map */}
            {monthData.days.map((dayObj, i) => {
              if (!dayObj) return <View key={`empty-${i}`} className="w-[14.28%] aspect-square p-[3px]" />;

              const completedCount = habits.filter(h => h.completedDates.includes(dayObj.dateStr)).length;
              const percentage = maxPossibleCompletions ? completedCount / maxPossibleCompletions : 0;
              const isToday = dayObj.dateStr === todayStr;

              // Heatmap Logic
              let bgClass = "bg-zinc-800/40 border-zinc-800/50";
              let textClass = "text-zinc-600";
              
              if (completedCount > 0) {
                if (percentage === 1) { 
                  bgClass = "bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-500/30"; 
                  textClass = "text-emerald-950 font-black"; 
                }
                else if (percentage >= 0.5) { 
                  bgClass = "bg-emerald-600 border-emerald-500"; 
                  textClass = "text-black"; 
                }
                else { 
                  bgClass = "bg-emerald-900/80 border-emerald-800/60"; 
                  textClass = "text-emerald-200"; 
                }
              }

              // Apply today's border highlight if no active color override is present
              if (isToday) {
                 bgClass += " border-emerald-400/80 border-2";
              }

              return (
                <View key={i} className="w-[14.28%] aspect-square p-[3px]">
                  <Animated.View className={`flex-1 rounded-[8px] items-center justify-center border ${bgClass}`}>
                    <Text className={`text-[12px] font-bold ${textClass}`}>
                      {dayObj.day}
                    </Text>
                  </Animated.View>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
