import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  return (
    <View className='flex-1 items-center justify-center gap-2 bg-background'>
      <Text className='text-h1 font-poppins-bold text-primary'>lingua</Text>
      <Link href='/onboarding' className='mt-4 text-body-lg font-poppins-medium text-primary'>
        View onboarding
      </Link>
    </View>
  );
}
