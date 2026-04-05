import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import PlantVisual from "../../components/PlantVisual";
import { useHabitStore } from "../../store/useHabitStore";

export default function HabitDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const habit = useHabitStore((state) => state.habits.find((h) => h.id === id));
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const [dailyQuote, setDailyQuote] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchQuote = async () => {
      const todayStr = new Date().toDateString();
      const storageKey = `@quote_${id}`;

      try {
        const cached = await AsyncStorage.getItem(storageKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.date === todayStr) {
            setDailyQuote(parsed.quote);
            return;
          }
        }

        // Fetch a new quote for this specific day
        const response = await fetch("https://quotes15.p.rapidapi.com/quotes/random/?language_code=en", {
          method: 'GET',
          headers: {
            'x-rapidapi-key': process.env.EXPO_PUBLIC_RAPIDAPI_KEY || '',
            'x-rapidapi-host': 'quotes15.p.rapidapi.com',
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();

        if (data && data.content) {
          const fetchedQuote = `${data.content} — ${data.originator?.name || 'Unknown'}`;
          setDailyQuote(fetchedQuote);
          await AsyncStorage.setItem(
            storageKey,
            JSON.stringify({ date: todayStr, quote: fetchedQuote }),
          );
        }
      } catch (err) {
        setDailyQuote("Consistency grows life. Water your garden.");
      }
    };

    fetchQuote();
  }, [id]);

  if (!habit) return <View className="flex-1 bg-black" />;

  const handleDelete = () => {
    deleteHabit(habit.id);
    router.back();
  };

  const handleEdit = () => {
    router.push({ pathname: "/edit-habit", params: { id: habit.id } });
  };

  return (
    <View
      className="flex-1 bg-black px-6 pt-16"
      style={{ backgroundColor: "#0D0D0D" }}
    >
      <View className="flex-row justify-between items-center mb-10">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-3 bg-zinc-900 rounded-full"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleEdit}
            className="p-3 bg-zinc-900 rounded-full border border-zinc-800"
          >
            <Edit3 size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            className="p-3 bg-red-500/10 rounded-full border border-red-500/30"
          >
            <Trash2 size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        entering={ZoomIn.duration(1200).springify(400, 25)}
        exiting={FadeIn.duration(200)}
        className="items-center mb-10"
      >
        <PlantVisual
          stage={habit.plantStage}
          size={150}
          health={100}
          floraType={habit.floraType}
        />
      </Animated.View>

      <Text className="text-4xl font-black text-white text-center mb-2">
        {habit.title}
      </Text>
      <Text className="text-xl text-green-400 font-bold text-center mb-10">
        🔥 {habit.streak} Day Streak •{" "}
        {habit.floraType === "oak"
          ? "Oak"
          : habit.floraType === "bamboo"
            ? "Bamboo"
            : "Vine"}
      </Text>

      <View className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 flex-row justify-between">
        <View className="items-center">
          <Text className="text-zinc-400 font-medium mb-1">Longest Streak</Text>
          <Text className="text-3xl font-bold text-white">
            {habit.longestStreak}
          </Text>
        </View>
        <View className="w-[1px] bg-zinc-800" />
        <View className="items-center">
          <Text className="text-zinc-400 font-medium mb-1">Growth Score</Text>
          <Text className="text-3xl font-bold text-white">
            {habit.growthScore}%
          </Text>
        </View>
      </View>

      <View className="mt-8 items-center px-4">
        {dailyQuote !== "" && (
          <Text className="text-center text-zinc-500 text-lg italic tracking-wide mb-6">
            &quot;{dailyQuote}&quot;
          </Text>
        )}
      </View>
    </View>
  );
}
