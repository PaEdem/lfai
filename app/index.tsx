import { useAuth } from '@clerk/expo';
import { Redirect, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href='/onboarding' />;
  }

  return (
    <View className='flex-1 items-center justify-center gap-2 bg-background'>
      <Text className='text-h1 font-poppins-bold text-primary'>lingua</Text>

      {/* TODO: remove once a real home screen / settings entry exists */}
      <TouchableOpacity
        onPress={() => router.push('/language-selection')}
        className='mt-6 rounded-full bg-primary px-6 py-3'
      >
        <Text className='text-body-lg font-poppins-semibold text-white'>Выбрать язык</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => signOut()} className='rounded-full bg-primary px-6 py-3'>
        <Text className='text-body-lg font-poppins-semibold text-white'>Выйти</Text>
      </TouchableOpacity>
    </View>
  );
}
