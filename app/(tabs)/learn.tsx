import { colors } from '@/constants/theme';
import { getLanguageByCode } from '@/data/languages';
import { getLessonsByUnit } from '@/data/lessons';
import { getUnitsByLanguage } from '@/data/units';
import { useLanguageStore } from '@/store/languageStore';
import { useProgressStore } from '@/store/progressStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Learn() {
  const router = useRouter();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const completedLessonIds = useProgressStore((state) => state.completedLessonIds);

  const language = selectedLanguage ? getLanguageByCode(selectedLanguage) : undefined;
  const units = selectedLanguage ? getUnitsByLanguage(selectedLanguage) : [];

  if (!language) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
        <View className='flex-1 items-center justify-center gap-4 px-8'>
          <Text className='text-center text-h3 font-poppins-semibold text-text-primary'>Сначала выбери язык</Text>
          <Text className='text-center text-body-md text-text-secondary'>
            Чтобы увидеть уроки, выбери язык, который хочешь изучать.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/language-selection')}
            activeOpacity={0.85}
            className='mt-2 rounded-full bg-primary px-6 py-3'
          >
            <Text className='text-body-lg font-poppins-semibold text-white'>Выбрать язык</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView
        className='flex-1 px-5'
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className='mt-2 flex-row items-center gap-3'>
          <Image source={{ uri: language.flagEmoji }} className='h-10 w-10 rounded-full bg-surface' />
          <View>
            <Text className='text-h3 font-poppins-semibold text-text-primary'>Уроки</Text>
            <Text className='text-body-sm text-text-secondary'>{language.name}</Text>
          </View>
        </View>

        <View className='mt-5 gap-3'>
          {units.map((unit) => {
            const lessons = getLessonsByUnit(unit.id);
            const completedCount = lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length;

            return (
              <TouchableOpacity
                key={unit.id}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '/unit/[unitId]', params: { unitId: unit.id } })}
                className='flex-row items-center rounded-2xl border border-border bg-white p-4'
              >
                <View className='h-11 w-11 items-center justify-center rounded-2xl bg-primary'>
                  <Text className='text-body-lg font-poppins-bold text-white'>{unit.order}</Text>
                </View>

                <View className='ml-3 flex-1'>
                  <Text className='text-body-lg font-poppins-semibold text-text-primary'>{unit.title}</Text>
                  <Text className='mt-0.5 text-body-sm text-text-secondary'>
                    {completedCount} / {lessons.length} уроков
                  </Text>
                </View>

                <Ionicons name='chevron-forward' size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
