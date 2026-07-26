import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();

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
      <TouchableOpacity onPress={() => signOut()} className='mt-6 rounded-full bg-primary px-6 py-3'>
        <Text className='text-body-lg font-poppins-semibold text-white'>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
