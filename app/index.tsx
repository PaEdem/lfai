import { getLanguageByCode } from '@/data/languages';
import { useLanguageStore } from '@/store/languageStore';
import { useAuth } from '@clerk/expo';
import { Redirect, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const router = useRouter();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);
  const clearSelectedLanguage = useLanguageStore((state) => state.clearSelectedLanguage);

  if (!isLoaded || !hasHydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href='/onboarding' />;
  }

  if (!selectedLanguage) {
    return <Redirect href='/language-selection' />;
  }

  const language = getLanguageByCode(selectedLanguage);

  return (
    <View className='flex-1 items-center justify-center gap-2 bg-background'>
      <Text className='text-h1 font-poppins-bold text-primary'>lingua</Text>

      {/* TODO(prompts/08-zustand.md): remove once a real home screen exists — testing async storage */}
      <Text className='text-body-lg font-poppins-medium text-text-secondary'>
        Выбранный язык: {language?.name ?? selectedLanguage}
      </Text>

      {/* TODO: remove once a real home screen / settings entry exists */}
      <TouchableOpacity
        onPress={() => router.push('/language-selection')}
        className='mt-6 rounded-full bg-primary px-6 py-3'
      >
        <Text className='text-body-lg font-poppins-semibold text-white'>Выбрать язык</Text>
      </TouchableOpacity>

      {/* TODO(prompts/08-zustand.md): remove once a real settings entry exists — testing async storage */}
      <TouchableOpacity onPress={() => clearSelectedLanguage()} className='rounded-full bg-primary px-6 py-3'>
        <Text className='text-body-lg font-poppins-semibold text-white'>Очистить хранилище языка</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => signOut()} className='rounded-full bg-primary px-6 py-3'>
        <Text className='text-body-lg font-poppins-semibold text-white'>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}
