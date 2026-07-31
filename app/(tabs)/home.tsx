import { getLanguageByCode } from '@/data/languages';
import { useLanguageStore } from '@/store/languageStore';
import { useAuth } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const { signOut } = useAuth();
  const router = useRouter();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const clearSelectedLanguage = useLanguageStore((state) => state.clearSelectedLanguage);

  const language = selectedLanguage ? getLanguageByCode(selectedLanguage) : undefined;

  return (
    <View className='flex-1 items-center justify-center gap-2 bg-background'>
      <Text className='text-h1 font-poppins-bold text-primary'>lingua</Text>
      <Text className='text-h3 font-poppins-semibold text-text-primary'>Главная</Text>

      {/* TODO(prompts/10-home-screen.md): remove once a real home screen exists — testing async storage */}
      <Text className='text-body-lg font-poppins-medium text-text-secondary'>
        Выбранный язык: {language?.name ?? selectedLanguage}
      </Text>

      {/* TODO: remove once a real settings entry exists */}
      <TouchableOpacity
        onPress={() => router.push('/language-selection')}
        className='mt-6 rounded-full bg-primary px-6 py-3'
      >
        <Text className='text-body-lg font-poppins-semibold text-white'>Выбрать язык</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          clearSelectedLanguage();
          router.replace('/');
        }}
        className='rounded-full bg-primary px-6 py-3'
      >
        <Text className='text-body-lg font-poppins-semibold text-white'>Очистить хранилище языка</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          signOut();
          router.replace('/');
        }}
        className='rounded-full bg-primary px-6 py-3'
      >
        <Text className='text-body-lg font-poppins-semibold text-white'>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}
