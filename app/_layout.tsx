import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import '../global.css';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0D0D0D' } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-habit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="habit/[id]" />
      </Stack>
    </>
  );
}

