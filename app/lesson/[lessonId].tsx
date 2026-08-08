import { images } from '@/constants/images';
import { colors } from '@/constants/theme';
import { getLanguageByCode } from '@/data/languages';
import { getLessonById } from '@/data/lessons';
import { fetchLessonCallCredentials, getStreamVideoClient } from '@/lib/stream';
import { useAuth, useUser } from '@clerk/expo';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  StreamCall,
  StreamVideo,
  useCallStateHooks,
  type Call,
  type StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CallStatus = 'connecting' | 'joined' | 'error' | 'ended';

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
  const { getToken } = useAuth();
  const { user } = useUser();

  const [areSubtitlesOn, setAreSubtitlesOn] = useState(true);
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const hasLeftRef = useRef(false);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const callRef = useRef<Call | null>(null);

  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const language = lesson ? getLanguageByCode(lesson.languageCode) : undefined;
  const openingPhrase = lesson?.phrases[0];

  const connect = useCallback(async () => {
    if (!lesson || !user) return;

    hasLeftRef.current = false;
    setCallStatus('connecting');
    setErrorMessage(null);

    try {
      const clerkToken = await getToken();
      if (!clerkToken) throw new Error('Не удалось получить токен авторизации.');

      const credentials = await fetchLessonCallCredentials({ lessonId: lesson.id, clerkToken });

      const videoClient = getStreamVideoClient({
        apiKey: credentials.apiKey,
        token: credentials.token,
        user: {
          id: credentials.userId,
          name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? undefined,
          image: user.imageUrl,
        },
      });
      // Присваиваем сразу после создания клиента (а не после join), чтобы cleanup
      // мог отключить пользователя, даже если join ниже упадёт с ошибкой.
      clientRef.current = videoClient;
      const videoCall = videoClient.call(credentials.callType, credentials.callId);

      await videoCall.join({ create: true });

      callRef.current = videoCall;
      setClient(videoClient);
      setCall(videoCall);
      setCallStatus('joined');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Не удалось подключиться к уроку.');
      setCallStatus('error');
    }
  }, [lesson, user, getToken]);

  useEffect(() => {
    void connect();

    return () => {
      if (hasLeftRef.current) return;
      hasLeftRef.current = true;
      void callRef.current?.leave().catch(() => {});
      void clientRef.current?.disconnectUser().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id, user?.id]);

  const handleEndCall = async () => {
    if (hasLeftRef.current) return;
    hasLeftRef.current = true;
    await call?.leave().catch(() => {});
    await client?.disconnectUser().catch(() => {});
    setCallStatus('ended');
  };

  const handleHangupPress = () => {
    if (callStatus === 'joined') {
      void handleEndCall();
    } else {
      router.back();
    }
  };

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

  const statusLabel: Record<CallStatus, string> = {
    connecting: 'Подключение…',
    joined: 'В сети',
    error: 'Ошибка подключения',
    ended: 'Урок завершён',
  };
  const statusDotClassName: Record<CallStatus, string> = {
    connecting: 'bg-warning',
    joined: 'bg-success',
    error: 'bg-error',
    ended: 'bg-border',
  };

  const body = (
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
            <View className={`h-2 w-2 rounded-full ${statusDotClassName[callStatus]}`} />
            <Text className='text-body-sm text-text-secondary'>
              {language.name} • {statusLabel[callStatus]}
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

        {/* Своё превью — аватар пользователя с индикатором микрофона */}
        <View className='absolute right-4 top-4 h-20 w-16 overflow-hidden rounded-2xl border-2 border-white bg-surface'>
          {user?.imageUrl ? (
            <Image source={{ uri: user.imageUrl }} className='h-full w-full' resizeMode='cover' />
          ) : (
            <View className='h-full w-full items-center justify-center'>
              <Ionicons name='person' size={22} color={colors.textSecondary} />
            </View>
          )}
          {callStatus === 'joined' && <MuteBadge />}
        </View>

        {callStatus === 'connecting' && (
          <View className='absolute inset-0 items-center justify-center bg-white/70 px-6'>
            <ActivityIndicator size='large' color={colors.primary} />
            <Text className='mt-3 text-center text-body-md font-poppins-semibold text-text-primary'>
              Подключаемся к уроку…
            </Text>
          </View>
        )}

        {callStatus === 'error' && (
          <View className='absolute inset-0 items-center justify-center bg-white/95 px-6'>
            <Ionicons name='alert-circle-outline' size={32} color={colors.error} />
            <Text className='mt-2 text-center text-body-md text-text-secondary'>{errorMessage}</Text>
            <TouchableOpacity
              onPress={() => void connect()}
              activeOpacity={0.85}
              className='mt-4 rounded-full bg-primary px-5 py-2.5'
            >
              <Text className='text-body-md font-poppins-semibold text-white'>Попробовать снова</Text>
            </TouchableOpacity>
          </View>
        )}

        {openingPhrase && callStatus === 'joined' && (
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
      {callStatus === 'ended' ? (
        <View className='mt-6 items-center rounded-2xl border border-border bg-white p-6'>
          <Ionicons name='checkmark-circle' size={32} color={colors.success} />
          <Text className='mt-2 text-body-lg font-poppins-semibold text-text-primary'>Урок завершён</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            className='mt-4 rounded-full bg-primary px-6 py-3'
          >
            <Text className='text-body-md font-poppins-semibold text-white'>Вернуться</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className='mt-6 flex-row justify-between px-2'>
          <ControlButton
            label='Камера'
            disabled
            icon={<Ionicons name='videocam-outline' size={22} color={colors.textPrimary} />}
          />

          {callStatus === 'joined' ? (
            <MicToggleButton />
          ) : (
            <ControlButton
              label='Микрофон'
              disabled
              icon={<Ionicons name='mic' size={22} color={colors.textPrimary} />}
            />
          )}

          <ControlButton
            label='Субтитры'
            active={areSubtitlesOn}
            disabled={callStatus !== 'joined'}
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
              onPress={handleHangupPress}
              activeOpacity={0.85}
              className='h-14 w-14 items-center justify-center rounded-full bg-error'
            >
              <MaterialCommunityIcons name='phone-hangup' size={24} color='#FFFFFF' />
            </TouchableOpacity>
            <Text className='mt-1.5 text-caption text-text-secondary'>Завершить</Text>
          </View>
        </View>
      )}

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
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      {client && call ? (
        <StreamVideo client={client}>
          <StreamCall call={call}>{body}</StreamCall>
        </StreamVideo>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

function MuteBadge() {
  const { useMicrophoneState } = useCallStateHooks();
  const { optimisticIsMute } = useMicrophoneState();

  if (!optimisticIsMute) return null;

  return (
    <View className='absolute bottom-1 right-1 h-5 w-5 items-center justify-center rounded-full bg-error'>
      <Ionicons name='mic-off' size={12} color='#FFFFFF' />
    </View>
  );
}

function MicToggleButton() {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, optimisticIsMute } = useMicrophoneState();

  return (
    <ControlButton
      label='Микрофон'
      active={!optimisticIsMute}
      onPress={() => void microphone.toggle()}
      icon={
        <Ionicons
          name={optimisticIsMute ? 'mic-off' : 'mic'}
          size={22}
          color={optimisticIsMute ? colors.error : colors.textPrimary}
        />
      }
    />
  );
}

function ControlButton({
  label,
  icon,
  active = true,
  disabled = false,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  return (
    <View className='items-center'>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.85}
        className={`h-14 w-14 items-center justify-center rounded-full border ${
          active ? 'border-border bg-white' : 'border-error/30 bg-error/10'
        } ${disabled ? 'opacity-40' : ''}`}
      >
        {icon}
      </TouchableOpacity>
      <Text className='mt-1.5 text-caption text-text-secondary'>{label}</Text>
    </View>
  );
}
