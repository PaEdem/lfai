import { CustomTabBar } from '@/components/navigation/CustomTabBar';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name='home' options={{ title: 'Главная' }} />
      <Tabs.Screen name='learn' options={{ title: 'Уроки' }} />
      <Tabs.Screen name='ai-teacher' options={{ title: 'ИИ-учитель' }} />
      <Tabs.Screen name='chat' options={{ title: 'Чат' }} />
      <Tabs.Screen name='profile' options={{ title: 'Профиль' }} />
    </Tabs>
  );
}
