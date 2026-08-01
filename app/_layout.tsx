import "../global.css";

import { fontAssets } from "@/constants/fonts";
import { posthog } from "@/constants/posthog";
import {
  PostHogErrorBoundary,
  PostHogProvider,
} from "posthog-react-native";
import { ClerkProvider, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

function IdentifiedApp() {
  const { isLoaded, user } = useUser();
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !posthog) {
      return;
    }

    if (user?.id) {
      posthog.identify(user.id, {
        $set: {
          email: user.primaryEmailAddress?.emailAddress ?? null,
          name: user.fullName ?? null,
        },
      });
      lastUserId.current = user.id;
      return;
    }

    if (lastUserId.current) {
      posthog.reset();
      lastUserId.current = null;
    }
  }, [isLoaded, user?.id, user?.primaryEmailAddress?.emailAddress, user?.fullName]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const app = (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <IdentifiedApp />
    </ClerkProvider>
  );

  return posthog ? (
    <PostHogProvider client={posthog}>
      <PostHogErrorBoundary>{app}</PostHogErrorBoundary>
    </PostHogProvider>
  ) : (
    app
  );
}
