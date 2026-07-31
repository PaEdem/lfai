import { images } from '@/constants/images';
import { colors } from '@/constants/theme';
import { getLanguageByCode } from '@/data/languages';
import { getLessonsByUnit } from '@/data/lessons';
import { getUnitsByLanguage } from '@/data/units';
import { useLanguageStore } from '@/store/languageStore';
import { useProgressStore } from '@/store/progressStore';
import type { ActivityType } from '@/types/learning';
import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ComponentProps } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const ACTIVITY_META: Record<ActivityType, { icon: IoniconName; bgClassName: string }> = {
  warmup: { icon: 'chatbubble-ellipses-outline', bgClassName: 'bg-primary' },
  vocabulary: { icon: 'book-outline', bgClassName: 'bg-info' },
  phrases: { icon: 'mic-outline', bgClassName: 'bg-error' },
  review: { icon: 'checkmark-done-outline', bgClassName: 'bg-success' },
};

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);

  const streakDays = useProgressStore((state) => state.streakDays);
  const xpToday = useProgressStore((state) => state.xpToday);
  const dailyGoalXp = useProgressStore((state) => state.dailyGoalXp);
  const completedActivityIds = useProgressStore((state) => state.completedActivityIds);

  const language = selectedLanguage ? getLanguageByCode(selectedLanguage) : undefined;
  // Пока нет отслеживания завершённых уроков — считаем текущим первый раздел языка.
  const currentUnit = selectedLanguage ? getUnitsByLanguage(selectedLanguage)[0] : undefined;
  const currentLesson = currentUnit ? getLessonsByUnit(currentUnit.id)[0] : undefined;

  const goalProgress = Math.min(100, Math.round((xpToday / dailyGoalXp) * 100));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView
        className='flex-1 px-5'
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Приветствие */}
        <View className='mt-2 flex-row items-center justify-between'>
          <View className='flex-row items-center gap-3'>
            {language && <Image source={{ uri: language.flagEmoji }} className='h-10 w-10 rounded-full bg-surface' />}
            <Text className='text-h4 font-poppins-medium text-text-primary'>Hei, {user?.firstName ?? '...'}! 👋</Text>
          </View>

          <View className='flex-row items-center gap-3'>
            <View className='flex-row items-center gap-1'>
              <Text className='text-body-lg'>🔥</Text>
              <Text className='text-body-lg font-poppins-semibold text-streak'>{streakDays}</Text>
            </View>
            <Ionicons name='notifications-outline' size={22} color={colors.textPrimary} />
          </View>
        </View>

        {/* Дневная цель */}
        <View className='mt-5 flex-row items-center justify-between rounded-3xl bg-orange-50 p-5'>
          <View className='flex-1'>
            <Text className='text-body-md text-text-secondary'>Дневная цель</Text>
            <Text className='mt-1 text-h2 font-poppins-bold text-text-primary'>
              {xpToday}
              <Text className='text-body-md font-poppins-regular text-text-secondary'> / {dailyGoalXp} XP</Text>
            </Text>
            <View className='mt-3 h-2 w-full overflow-hidden rounded-full bg-white'>
              <View className='h-2 rounded-full bg-streak' style={{ width: `${goalProgress}%` }} />
            </View>
          </View>
          <Image source={images.treasure} className='ml-4 h-20 w-20' resizeMode='contain' />
        </View>

        {/* Продолжить обучение */}
        {language && currentUnit && (
          <TouchableOpacity
            activeOpacity={0.9}
            // TODO(prompts/11-lesson-ui.md): перейти на экран урока, когда он появится
            className='mt-5 overflow-hidden rounded-3xl bg-primary p-5'
          >
            <Text className='text-body-md text-white/80'>Продолжить обучение</Text>
            <Text className='mt-1 text-h2 font-poppins-bold text-white'>{language.name}</Text>
            <Text className='mt-0.5 text-body-md text-white/80'>
              Раздел {currentUnit.order}: {currentUnit.title}
            </Text>

            <View className='mt-4 flex-row items-end justify-between'>
              <View className='self-start rounded-full bg-white px-5 py-2.5'>
                <Text className='text-body-md font-poppins-semibold text-primary'>Продолжить</Text>
              </View>
              <Image source={images.palace} className='h-20 w-28' resizeMode='contain' />
            </View>
          </TouchableOpacity>
        )}

        {/* План на сегодня */}
        {currentLesson && (
          <View className='mt-6'>
            <View className='flex-row items-center justify-between'>
              <Text className='text-h4 font-poppins-semibold text-text-primary'>План на сегодня</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/learn')}>
                <Text className='text-body-md font-poppins-medium text-primary'>Все уроки</Text>
              </TouchableOpacity>
            </View>

            <View className='mt-3 gap-3'>
              {currentLesson.activities.map((activity) => {
                const meta = ACTIVITY_META[activity.type];
                const isDone = completedActivityIds.includes(activity.id);

                return (
                  <View
                    key={activity.id}
                    className='flex-row items-center rounded-2xl border border-border bg-white p-3'
                  >
                    <View className={`h-11 w-11 items-center justify-center rounded-2xl ${meta.bgClassName}`}>
                      <Ionicons name={meta.icon} size={20} color='#FFFFFF' />
                    </View>

                    <View className='ml-3 flex-1'>
                      <Text className='text-body-lg font-poppins-medium text-text-primary'>{activity.title}</Text>
                      <Text className='text-body-sm text-text-secondary'>{activity.description}</Text>
                    </View>

                    {isDone ? (
                      <View className='h-7 w-7 items-center justify-center rounded-full bg-primary'>
                        <Ionicons name='checkmark' size={16} color='#FFFFFF' />
                      </View>
                    ) : (
                      <View className='h-7 w-7 rounded-full border border-border' />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
