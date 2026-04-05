import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForLocalNotificationsAsync() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10B981',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.warn("Could not register notifications (this is normal in some Expo Go environments):", error);
    return false;
  }
}

export async function testNotification() {
  let bodyText = "This is how your daily reminder will look!";
  
  try {
    const res = await fetch('https://zenquotes.io/api/random');
    const data = await res.json();
    if (data && data.length > 0) {
      bodyText = `"${data[0].q}" - ${data[0].a}`;
    }
  } catch (e) {
    console.log("Failed to fetch zenquotes test", e);
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌱 Time to grow!",
      body: bodyText,
      sound: true,
    },
    trigger: null, // Schedule immediately
  });
}

export async function scheduleDailyReminder(timeString: string | null) {
  // First cancel all previously scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  if (!timeString) return;

  const date = new Date(timeString);
  const hour = date.getHours();
  const minute = date.getMinutes();

  let quotes: any[] = [];
  try {
    const res = await fetch('https://zenquotes.io/api/quotes');
    quotes = await res.json();
  } catch (e) {
    console.log("Failed to fetch zenquotes array", e);
  }

  // If we couldn't fetch quotes, fall back to the simple generic daily repeating reminder
  if (!quotes || quotes.length === 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌱 Time to grow!",
        body: "Don't forget to water your garden and mark your habits for today.",
        sound: true,
      },
      trigger: { hour, minute, repeats: true } as Notifications.DailyTriggerInput,
    });
    return;
  }

  // Generate the start date (the next upcoming chosen hour/minute)
  const currentTrigger = new Date();
  currentTrigger.setHours(hour, minute, 0, 0);
  if (currentTrigger.getTime() < Date.now()) {
    currentTrigger.setDate(currentTrigger.getDate() + 1);
  }

  // Schedule exactly 30 individualized non-repeating notifications for the next 30 days
  // Each day will have its own unique quote from the API response
  const maxDays = Math.min(30, quotes.length);
  for (let i = 0; i < maxDays; i++) {
    const triggerDate = new Date(currentTrigger);
    triggerDate.setDate(triggerDate.getDate() + i);

    const quoteObj = quotes[i];
    const bodyText = `"${quoteObj.q}" - ${quoteObj.a}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🌱 Time to grow!",
        body: bodyText,
        sound: true,
      },
      trigger: triggerDate,
    });
  }
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}