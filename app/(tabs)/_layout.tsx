import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { BarChart2, Home, Settings, Sprout } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { useProfileStore } from '../../store/useProfileStore';

export default function TabLayout() {
  const hapticsEnabled = useProfileStore((state) => state.hapticsEnabled);

  return (
    <Tabs
      screenListeners={{
        tabPress: () => {
          if (hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        },
      }}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#09090b' },
        sceneContainerStyle: { backgroundColor: '#09090b' },
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 0,
          elevation: 10, // soft shadow for Android
          shadowColor: '#000', // shadow for iOS
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 15,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          position: 'absolute', // required to make it float
          bottom: 40, // moves the box 35px up from the screen bottom
          left: 20, // side margins
          right: 20,
          borderRadius: 30, // fully rounded edges for a pill effect
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textDim,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={28} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="garden"
        options={{
          title: 'Garden',
          tabBarIcon: ({ color }) => <Sprout size={28} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <BarChart2 size={28} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={28} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}