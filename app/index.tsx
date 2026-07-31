import { useLanguageStore } from '@/store/languageStore';
import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  if (!isLoaded || !hasHydrated) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href='/onboarding' />;
  }

  if (!selectedLanguage) {
    return <Redirect href='/language-selection' />;
  }

  return <Redirect href='/(tabs)/home' />;
}
