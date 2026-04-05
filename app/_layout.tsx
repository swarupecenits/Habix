import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";
import '../global.css';
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { registerForLocalNotificationsAsync } from '../utils/notifications';
import { supabase } from "../utils/supabase";
import { restoreProfileFromCloud } from '../utils/syncService';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setSession = useAuthStore(state => state.setSession);
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);

  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  // Auto-restore profile metadata silently in background on boot
  const syncProfileStateIfAvailable = async (userId: string) => {
    try {
      const cloudProfile = await restoreProfileFromCloud(userId);
      if (cloudProfile) {
        useProfileStore.getState().updateProfile({
          name: cloudProfile.name || 'Gardener',
          avatarUri: cloudProfile.avatar_url || null,
        });
      }
    } catch (e) {
      console.log('Background profile restore failed', e);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        syncProfileStateIfAvailable(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        syncProfileStateIfAvailable(session.user.id);
      }
    });

    // Ask for notification permissions slightly after boot to avoid blocking UI immediately
    setTimeout(() => {
      registerForLocalNotificationsAsync();
    }, 1500);

    // Determine when app resources are ready
    setTimeout(() => {
      setAppIsReady(true);
    }, 100);

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Hide the default static native splash immediately
      SplashScreen.hideAsync();

      // Chain the beautiful JS spring + fade animation
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1,
          tension: 10,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.delay(400), // Keep it glowing for a short bit
        Animated.timing(opacity, {
          toValue: 0,
          duration: 350,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => setSplashFinished(true));
    }
  }, [appIsReady]);

  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#09090b' }, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-habit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit-habit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="habit/[id]" />
      </Stack>

      {/* Custom Aesthetic Animated Splash Screen overlapping the App until dissolved */}
      {!splashFinished && (
        <Animated.View
          style={{ opacity }}
          className="absolute top-0 bottom-0 left-0 right-0 bg-[#09090b] items-center justify-center flex-1 z-[999]"
          pointerEvents="none"
        >
          {/* Aesthetic background glow */}
          <View className="absolute w-96 h-96 bg-emerald-900/20 rounded-full blur-[100px]" />
          
          <Animated.View style={{ transform: [{ scale }] }} className="items-center">
            <View className="w-32 h-32 bg-emerald-900/30 rounded-full border border-emerald-500/20 shadow-2xl items-center justify-center mb-6">
              <Text className="text-7xl shadow-xl shadow-emerald-500/50">🌱</Text>
            </View>
            <Text className="text-5xl font-black text-white tracking-widest drop-shadow-lg">HABIX</Text>
            <Text className="text-emerald-500 font-bold tracking-widest text-xs mt-3 uppercase">Grow Your Garden</Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

