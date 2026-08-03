import { images } from '@/constants/images';
import { colors } from '@/constants/theme';
import { getLanguageByCode } from '@/data/languages';
import { getLessonById } from '@/data/lessons';
// import { useUser } from '@clerk/expo'; // вернуть вместе с превью камеры (prompts/13-stream-integration.md)
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const FEEDBACK = [
  { label: 'Говорение', value: 'Отлично', colorClassName: 'text-success' },
  { label: 'Произношение', value: 'Хорошо', colorClassName: 'text-primary' },
  { label: 'Грамматика', value: 'Неплохо', colorClassName: 'text-primary' },
] as const;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
});

export default function LessonScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  // const { user } = useUser(); // вернуть вместе с превью камеры (prompts/13-stream-integration.md)

  const [isMicOn, setIsMicOn] = useState(true);
  const [areSubtitlesOn, setAreSubtitlesOn] = useState(true);

  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const language = lesson ? getLanguageByCode(lesson.languageCode) : undefined;
  const openingPhrase = lesson?.phrases[0];

  if (!lesson || !language) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className='flex-1 items-center justify-center px-6'>
          <Text className='text-body-lg text-text-secondary'>Урок не найден.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView className='flex-1 px-5' contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        {/* Шапка */}
        <View className='flex-row items-start justify-between pt-2'>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} className='pt-1'>
            <Ionicons name='chevron-back' size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View className='flex-1 px-3'>
            <Text className='text-h4 font-poppins-semibold text-text-primary' numberOfLines={1}>
              {lesson.title}
            </Text>
            <View className='mt-1 flex-row items-center gap-1.5'>
              <View className='h-2 w-2 rounded-full bg-success' />
              <Text className='text-body-sm text-text-secondary'>
                {language.name} • В сети
              </Text>
            </View>
          </View>

          <View className='flex-row items-center gap-2'>
            <View className='h-9 w-9 items-center justify-center rounded-full border border-border'>
              <Ionicons name='videocam-outline' size={17} color={colors.textPrimary} />
            </View>
            <View className='h-9 w-9 items-center justify-center rounded-full border border-border'>
              <Text className='text-body-sm font-poppins-semibold text-text-primary'>{lesson.estimatedMinutes}</Text>
            </View>
            <View className='h-9 w-9 items-center justify-center rounded-full border border-border'>
              <Ionicons name='notifications-outline' size={17} color={colors.textPrimary} />
            </View>
          </View>
        </View>

        <Text className='mt-3 text-body-sm text-text-secondary'>Цель урока: {lesson.goal}</Text>

        {/* Учитель и реплика */}
        <View className='mt-4 overflow-hidden rounded-3xl bg-[#F5F3FF]'>
          <View className='items-center px-6 pb-24 pt-8'>
            <Image source={images.mascotWelcome} className='h-56 w-56' resizeMode='contain' />
          </View>

          {/* Превью своей камеры — пока видео нет, скрыто до реальной интеграции звонка (prompts/13-stream-integration.md) */}
          {/* <View className='absolute right-4 top-4 h-20 w-16 overflow-hidden rounded-2xl border-2 border-white bg-surface'>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} className='h-full w-full' resizeMode='cover' />
            ) : (
              <View className='h-full w-full items-center justify-center'>
                <Ionicons name='person' size={22} color={colors.textSecondary} />
              </View>
            )}
          </View> */}

          {openingPhrase && (
            <View className='absolute bottom-4 left-4 right-4 rounded-2xl bg-white p-4' style={styles.cardShadow}>
              <View className='flex-row items-center justify-between'>
                <View className='flex-1 pr-3'>
                  <Text className='text-body-lg font-poppins-semibold text-text-primary'>{openingPhrase.text}</Text>
                  {areSubtitlesOn && (
                    <Text className='mt-1 text-body-md text-text-secondary'>{openingPhrase.translation}</Text>
                  )}
                </View>
                <Ionicons name='volume-high' size={22} color={colors.primary} />
              </View>
            </View>
          )}
        </View>

        {/* Управление */}
        <View className='mt-6 flex-row justify-between px-2'>
          <ControlButton
            label='Камера'
            icon={<Ionicons name='videocam-outline' size={22} color={colors.textPrimary} />}
          />

          <ControlButton
            label='Микрофон'
            active={isMicOn}
            onPress={() => setIsMicOn((prev) => !prev)}
            icon={
              <Ionicons
                name={isMicOn ? 'mic' : 'mic-off'}
                size={22}
                color={isMicOn ? colors.textPrimary : colors.error}
              />
            }
          />

          <ControlButton
            label='Субтитры'
            active={areSubtitlesOn}
            onPress={() => setAreSubtitlesOn((prev) => !prev)}
            icon={
              <MaterialCommunityIcons
                name={areSubtitlesOn ? 'closed-caption' : 'closed-caption-outline'}
                size={22}
                color={colors.textPrimary}
              />
            }
          />

          <View className='items-center'>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.85}
              className='h-14 w-14 items-center justify-center rounded-full bg-error'
            >
              <MaterialCommunityIcons name='phone-hangup' size={24} color='#FFFFFF' />
            </TouchableOpacity>
            <Text className='mt-1.5 text-caption text-text-secondary'>Завершить</Text>
          </View>
        </View>

        {/* Обратная связь по уроку */}
        <View className='mt-6 flex-row justify-between rounded-2xl border border-border bg-white p-4'>
          {FEEDBACK.map((item) => (
            <View key={item.label} className='items-center'>
              <Text className='text-body-sm font-poppins-semibold text-text-primary'>{item.label}</Text>
              <Text className={`mt-1 text-body-md font-poppins-semibold ${item.colorClassName}`}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ControlButton({
  label,
  icon,
  active = true,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <View className='items-center'>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        className={`h-14 w-14 items-center justify-center rounded-full border ${
          active ? 'border-border bg-white' : 'border-error/30 bg-error/10'
        }`}
      >
        {icon}
      </TouchableOpacity>
      <Text className='mt-1.5 text-caption text-text-secondary'>{label}</Text>
    </View>
  );
}
