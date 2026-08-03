import { images } from '@/constants/images';
import { colors } from '@/constants/theme';
import { getLessonsByUnit } from '@/data/lessons';
import { getUnitById } from '@/data/units';
import { useProgressStore } from '@/store/progressStore';
import type { Lesson } from '@/types/learning';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LessonStatus = 'completed' | 'in-progress' | 'locked';
type UnitTab = 'lessons' | 'practice';

const styles = StyleSheet.create({
  tabsShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
});

export default function UnitScreen() {
  const router = useRouter();
  const { unitId } = useLocalSearchParams<{ unitId: string }>();
  const [activeTab, setActiveTab] = useState<UnitTab>('lessons');

  const completedLessonIds = useProgressStore((state) => state.completedLessonIds);

  const unit = unitId ? getUnitById(unitId) : undefined;
  const lessons = unit ? getLessonsByUnit(unit.id).sort((a, b) => a.order - b.order) : [];
  const completedCount = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;
  const firstIncompleteId = lessons.find((lesson) => !completedLessonIds.includes(lesson.id))?.id;

  if (!unit) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className='flex-1 items-center justify-center px-6'>
          <Text className='text-body-lg text-text-secondary'>Раздел не найден.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView className='flex-1' contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className='flex-row items-start justify-between px-5 pt-2'>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} className='pt-1'>
            <Ionicons name='chevron-back' size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View className='flex-1 items-center px-2'>
            <Text className='text-h3 font-poppins-semibold text-text-primary' numberOfLines={1}>
              {unit.title}
            </Text>
            <Text className='mt-0.5 text-body-sm text-text-secondary'>
              Раздел {unit.order} • {completedCount} / {lessons.length} уроков
            </Text>
          </View>

          <View className='pt-1'>
            <Ionicons name='bookmark-outline' size={22} color={colors.textPrimary} />
          </View>
        </View>

        <Image
          source={{ uri: `https://picsum.photos/seed/${unit.id}/800/600` }}
          className='mt-4 h-64 w-full rounded-b-[32px] bg-surface'
          resizeMode='cover'
        />

        <View className='-mt-6 mx-5 flex-row rounded-2xl bg-white p-1.5' style={styles.tabsShadow}>
          <TouchableOpacity
            onPress={() => setActiveTab('lessons')}
            activeOpacity={0.85}
            className='flex-1 items-center rounded-xl py-2.5'
          >
            <Text
              className={`text-body-md font-poppins-semibold ${
                activeTab === 'lessons' ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              Уроки
            </Text>
            {activeTab === 'lessons' && <View className='mt-1 h-0.5 w-8 rounded-full bg-primary' />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('practice')}
            activeOpacity={0.85}
            className='flex-1 items-center rounded-xl py-2.5'
          >
            <Text
              className={`text-body-md font-poppins-semibold ${
                activeTab === 'practice' ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              Практика
            </Text>
            {activeTab === 'practice' && <View className='mt-1 h-0.5 w-8 rounded-full bg-primary' />}
          </TouchableOpacity>
        </View>

        {activeTab === 'lessons' ? (
          <View className='mt-5 gap-3 px-5'>
            {lessons.map((lesson) => {
              const status: LessonStatus = completedLessonIds.includes(lesson.id)
                ? 'completed'
                : lesson.id === firstIncompleteId
                  ? 'in-progress'
                  : 'locked';

              return <LessonRow key={lesson.id} lesson={lesson} status={status} />;
            })}
          </View>
        ) : (
          <View className='mt-10 items-center px-6'>
            <Text className='text-body-lg font-poppins-medium text-text-secondary'>Практика скоро появится</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function LessonRow({ lesson, status }: { lesson: Lesson; status: LessonStatus }) {
  const router = useRouter();
  const isInProgress = status === 'in-progress';
  const isLocked = status === 'locked';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } })}
      className={`flex-row items-center rounded-2xl border p-4 ${
        isInProgress ? 'border-2 border-primary bg-[#F5F3FF]' : 'border-border bg-white'
      }`}
    >
      <View className='flex-1'>
        <Text className={`text-body-sm ${isInProgress ? 'text-primary' : 'text-text-secondary'}`}>
          Урок {lesson.order}
        </Text>
        <Text
          className={`mt-0.5 text-body-lg font-poppins-semibold ${
            isLocked ? 'text-text-secondary' : isInProgress ? 'text-primary' : 'text-text-primary'
          }`}
        >
          {lesson.title}
        </Text>
        {isInProgress && <Text className='mt-0.5 text-body-sm font-poppins-medium text-primary'>Изучается</Text>}
      </View>

      {status === 'completed' && (
        <View className='h-8 w-8 items-center justify-center rounded-full bg-success'>
          <Ionicons name='checkmark' size={18} color='#FFFFFF' />
        </View>
      )}
      {isInProgress && <Image source={images.palace} className='h-12 w-12' resizeMode='contain' />}
      {isLocked && <Ionicons name='lock-closed-outline' size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );
}
