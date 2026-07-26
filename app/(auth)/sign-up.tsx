import AuthForm from '@/components/auth/AuthForm';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <AuthForm mode='sign-up' />
    </SafeAreaView>
  );
}
