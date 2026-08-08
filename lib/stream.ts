import { StreamVideoClient } from '@stream-io/video-react-native-sdk';

export interface LessonCallUser {
  id: string;
  name?: string;
  image?: string;
}

export interface LessonCallCredentials {
  apiKey: string;
  token: string;
  userId: string;
  callId: string;
  callType: string;
}

export async function fetchLessonCallCredentials(params: {
  lessonId: string;
  clerkToken: string;
}): Promise<LessonCallCredentials> {
  const response = await fetch('/api/stream/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.clerkToken}`,
    },
    body: JSON.stringify({ lessonId: params.lessonId }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Не удалось подключиться к уроку.');
  }

  return response.json();
}

export function getStreamVideoClient(params: {
  apiKey: string;
  token: string;
  user: LessonCallUser;
}): StreamVideoClient {
  return StreamVideoClient.getOrCreateInstance({
    apiKey: params.apiKey,
    token: params.token,
    user: params.user,
  });
}
