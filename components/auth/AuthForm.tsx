import { images } from '@/constants/images';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import VerificationModal from './VerificationModal';

type AuthMode = 'sign-up' | 'sign-in';

const COPY: Record<
  AuthMode,
  {
    title: string;
    subtitle: string;
    cta: string;
    footerPrompt: string;
    footerAction: string;
    footerHref: '/sign-up' | '/sign-in';
  }
> = {
  'sign-up': {
    title: 'Create your account',
    subtitle: 'Start your language journey today ✨',
    cta: 'Sign Up',
    footerPrompt: 'Already have an account?',
    footerAction: 'Log in',
    footerHref: '/sign-in',
  },
  'sign-in': {
    title: 'Welcome back',
    subtitle: 'Continue your language journey ✨',
    cta: 'Sign In',
    footerPrompt: "Don't have an account?",
    footerAction: 'Sign up',
    footerHref: '/sign-up',
  },
};

const SOCIAL_PROVIDERS = [
  { key: 'google', label: 'Continue with Google', icon: 'logo-google', color: '#4285F4' },
] as const;

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const copy = COPY[mode];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [verificationVisible, setVerificationVisible] = useState(false);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
        <View className='flex-1 px-6'>
          <TouchableOpacity onPress={() => router.back()} className='py-2' hitSlop={12}>
            <Ionicons name='chevron-back' size={24} color='#0D132B' />
          </TouchableOpacity>

          <Text className='mt-4 text-h1 font-poppins-bold text-text-primary'>{copy.title}</Text>
          <Text className='mt-2 text-body-lg text-text-secondary'>{copy.subtitle}</Text>

          <View className='relative mt-6 items-center justify-center'>
            <Image source={images.mascotAuth} className='h-40 w-40' resizeMode='contain' />
            <Ionicons
              name='sparkles'
              size={16}
              color='#FFC800'
              style={{ position: 'absolute', left: '18%', top: '6%' }}
            />
            <Ionicons
              name='sparkles'
              size={20}
              color='#4D8BFF'
              style={{ position: 'absolute', right: '14%', top: '20%' }}
            />
            <Ionicons
              name='sparkles'
              size={14}
              color='#6C4EF5'
              style={{ position: 'absolute', right: '22%', bottom: '10%' }}
            />
          </View>

          <View className='gap-4'>
            <View className='rounded-2xl border border-border px-4 py-2'>
              <Text className='text-caption text-text-secondary'>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder='alex@gmail.com'
                placeholderTextColor='#6B7280'
                autoCapitalize='none'
                keyboardType='email-address'
                className='py-1 text-body-lg text-text-primary'
              />
            </View>

            {mode === 'sign-up' && (
              <View className='flex-row items-center rounded-2xl border border-border px-4 py-2'>
                <View className='flex-1'>
                  <Text className='text-caption text-text-secondary'>Password</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder='••••••••'
                    placeholderTextColor='#6B7280'
                    secureTextEntry={!passwordVisible}
                    className='py-1 text-body-lg text-text-primary'
                  />
                </View>
                <TouchableOpacity onPress={() => setPasswordVisible((v) => !v)} hitSlop={12}>
                  <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color='#6B7280' />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setVerificationVisible(true)}
            className='mt-6 items-center rounded-full bg-primary py-4'
          >
            <Text className='text-body-lg font-poppins-semibold text-white'>{copy.cta}</Text>
          </TouchableOpacity>

          <View className='mt-6 flex-row items-center gap-3'>
            <View className='h-px flex-1 bg-border' />
            <Text className='text-body-sm text-text-secondary'>or continue with</Text>
            <View className='h-px flex-1 bg-border' />
          </View>

          <View className='mt-6 gap-3'>
            {SOCIAL_PROVIDERS.map((provider) => (
              <TouchableOpacity
                key={provider.key}
                onPress={() => console.log(`TODO: wire up ${provider.key} OAuth via Clerk`)}
                className='flex-row items-center justify-center gap-3 rounded-2xl border border-border py-4'
              >
                <Ionicons name={provider.icon} size={20} color={provider.color} />
                <Text className='text-body-lg font-poppins-medium text-text-primary'>{provider.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className='mt-auto flex-row items-center justify-center gap-1 py-6'>
            <Text className='text-body-md text-text-secondary'>{copy.footerPrompt}</Text>
            <Link href={copy.footerHref} className='text-body-md font-poppins-semibold text-primary'>
              {copy.footerAction}
            </Link>
          </View>
        </View>
      </ScrollView>

      <VerificationModal visible={verificationVisible} email={email} onClose={() => setVerificationVisible(false)} />
    </KeyboardAvoidingView>
  );
}
