import { images } from '@/constants/images';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className='flex-1 px-6'>
        <View className='flex-row items-center justify-center gap-2 pt-2'>
          <Image source={images.mascotLogo} className='h-6 w-6' resizeMode='contain' />
          <Text className='text-h2 font-poppins-bold text-text-secondary'>lingua</Text>
        </View>

        <View className='mt-10'>
          <Text className='text-h1 text-center font-poppins-bold text-text-primary'>
            Your AI language{'\n'}
            <Text className='text-primary'>teacher.</Text>
          </Text>
          <Text className='mt-3 text-body-lg text-text-secondary'>
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        <View className='relative mt-6 w-full flex-1 items-center justify-center'>
          <Image source={images.mascotWelcome} className='h-[72%] w-[72%]' resizeMode='contain' />

          <View className='absolute left-[10%] top-[6%] rounded-2xl bg-[#EEF5FD] px-4 py-2 shadow-sm'>
            <Text className='font-poppins-medium text-text-primary'>Hello!</Text>
          </View>
          <View className='absolute right-[6%] top-0 rounded-2xl bg-[#EDEBFC] px-4 py-2 shadow-sm'>
            <Text className='font-poppins-medium text-primary-dark'>¡Hola!</Text>
          </View>
          <View className='absolute right-[4%] top-[25%] rounded-2xl bg-[#FCEEE7] px-4 py-2 shadow-sm'>
            <Text className='font-poppins-medium text-error'>你好!</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/sign-up')}
          className='mb-6 flex-row items-center justify-center gap-2 rounded-full bg-primary py-4'
        >
          <Text className='text-body-lg font-poppins-semibold text-white'>Get Started</Text>
          <Ionicons name='chevron-forward' size={20} color='#FFFFFF' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
